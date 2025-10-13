from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv
from generate_from_pdf import generate_from_pdf_content
import fitz  # PyMuPDF for PDF validation

load_dotenv()

app = Flask(__name__)
CORS(app)

# ======================
# Config
# ======================
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB limit

SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
FROM_EMAIL = os.environ.get("GMAIL_USER")  # Verified "From" email in SendGrid

# ======================
# Helpers
# ======================
def is_valid_email(email):
    return isinstance(email, str) and "@" in email

# ======================
# Routes
# ======================
@app.route("/api/send-flashcard", methods=["POST"])
def send_flashcard():
    data = request.json
    to_email = data.get("to")
    link = data.get("link")
    subject = data.get("subject", "Your SnapStudy Flashcards")

    if not to_email or not link:
        return jsonify({"error": "Missing 'to' or 'link'"}), 400
    if not is_valid_email(to_email):
        return jsonify({"error": "Invalid email"}), 400

    html_content = f"""
    <p>Hi —</p>
    <p>Here is the SnapStudy flashcard link you requested:</p>
    <p><a href="{link}">{link}</a></p>
    <p>Best,<br/>SnapStudy</p>
    """

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        return jsonify({
            "success": True,
            "message": "Email sent",
            "status_code": response.status_code
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/send-session-data", methods=["POST"])
def send_session_data():
    """Send complete flashcard session data via email using SendGrid API"""
    
    data = request.json
    to_email = data.get("to")
    flashcards = data.get("flashcards")
    deck_title = data.get("deck_title", "SnapStudy Flashcard Set")
    session_stats = data.get("session_stats", {})
    
    # Validate required fields
    if not to_email:
        return jsonify({"error": "Missing 'to' email address"}), 400
    
    if not flashcards or not isinstance(flashcards, list) or len(flashcards) == 0:
        return jsonify({"error": "Missing or invalid 'flashcards' data"}), 400
    
    if not is_valid_email(to_email):
        return jsonify({"error": "Invalid email address format"}), 400

    # Build HTML email content with flashcard data
    try:
        subject = f"Your SnapStudy Flashcard Set: {deck_title}"
        
        # Header
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; margin-bottom: 30px; color: #333; }}
                .stats {{ background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 25px; }}
                .flashcard {{ border: 1px solid #ddd; margin-bottom: 15px; border-radius: 8px; overflow: hidden; }}
                .flashcard-header {{ background-color: #007bff; color: white; padding: 10px 15px; font-weight: bold; }}
                .flashcard-content {{ padding: 15px; }}
                .term {{ font-weight: bold; color: #333; margin-bottom: 8px; font-size: 18px; }}
                .definition {{ color: #666; line-height: 1.4; }}
                .footer {{ text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 {deck_title}</h1>
                    <p>Your SnapStudy flashcard set is ready for review!</p>
                </div>
        """
        
        # Session statistics if provided
        if session_stats:
            total_cards = session_stats.get("total_cards", len(flashcards))
            known_count = session_stats.get("known_count", 0)
            unknown_count = session_stats.get("unknown_count", 0)
            progress_percent = session_stats.get("progress_percent", 0)
            
            html_content += f"""
                <div class="stats">
                    <h3>📊 Session Summary</h3>
                    <p><strong>Total Cards:</strong> {total_cards}</p>
                    <p><strong>Cards Mastered:</strong> {known_count}</p>
                    <p><strong>Cards to Review:</strong> {unknown_count}</p>
                    <p><strong>Progress:</strong> {progress_percent}% complete</p>
                </div>
            """
        
        # Flashcard content
        for i, card in enumerate(flashcards, 1):
            term = card.get("term") or card.get("practice_question") or card.get("question") or f"Question {i}"
            definition = card.get("definition") or card.get("answer") or "No answer provided"
            topic = card.get("topic") or "General"
            
            html_content += f"""
                <div class="flashcard">
                    <div class="flashcard-header">{deck_title} - Card {i}</div>
                    <div class="flashcard-content">
                        <div class="term">{term}</div>
                        <div class="definition">{definition}</div>
                    </div>
                </div>
            """
        
        # Footer
        html_content += f"""
                <div class="footer">
                    <p>Keep studying and good luck! 🎓</p>
                    <p><strong>SnapStudy Team</strong><br/>
                    Transform your PDFs into interactive flashcards</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create and send email
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        return jsonify({
            "success": True,
            "message": "Flashcard session data sent successfully",
            "status_code": response.status_code,
            "cards_sent": len(flashcards)
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

@app.route("/api/upload", methods=["POST"])
def upload_pdf():
    # 1. Check file exists
    if "pdfFile" not in request.files:
        return jsonify({"success": False, "error": "No file part in request"}), 400

    file = request.files["pdfFile"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    # 2. Only allow PDFs
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"success": False, "error": "Only PDF files are allowed"}), 400

    # 3. Validate and process PDF in memory
    try:
        file_content = file.read()
        # Validate PDF by opening from memory
        doc = fitz.open(stream=file_content, filetype="pdf")
        doc.close()
    except Exception as e:
        return jsonify({"success": False, "error": "Invalid PDF file"}), 400

    # 4. Generate flashcards from PDF content
    try:
        quiz_deck = generate_from_pdf_content(file_content)
        if not quiz_deck:
            return jsonify({"success": False, "error": "No flashcards generated from PDF"}), 400

        return jsonify({
            "success": True,
            "quiz_deck": quiz_deck
        })
    except Exception as e:
        return jsonify({"success": False, "error": f"Flashcard generation failed: {str(e)}"}), 500

@app.route("/api/health")
def health():
    return jsonify({"ok": True})

# ======================
# Main
# ======================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
