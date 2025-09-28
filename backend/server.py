from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from generate_from_pdf import generate_from_pdf
import fitz  # PyMuPDF for PDF validation

load_dotenv()

app = Flask(__name__)
CORS(app)

# ======================
# Config
# ======================
UPLOAD_FOLDER = "uploaded_pdfs"
LECTURE_FOLDER = "lecture_content"
QA_FOLDER = "q_a"

# Ensure folders exist
for folder in [UPLOAD_FOLDER, LECTURE_FOLDER, QA_FOLDER]:
    os.makedirs(folder, exist_ok=True)

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
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/upload", methods=["POST"])
def upload_pdf():
    import traceback

    # 1. Check file exists
    if "pdfFile" not in request.files:
        return jsonify({"success": False, "error": "No file part in request"}), 400

    file = request.files["pdfFile"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    # 2. Only allow PDFs
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"success": False, "error": "Only PDF files are allowed"}), 400

    # 3. Save file with unique name
    try:
        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        print(f"[UPLOAD] Saved PDF to: {save_path}")
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Failed to save file: {str(e)}"}), 500

    # 4. Validate PDF
    try:
        fitz.open(save_path).close()
        print(f"[UPLOAD] PDF is valid")
    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": "Invalid PDF file"}), 400

    # 5. Generate flashcards
    try:
        quiz_deck, summary_json_path, quiz_json_path = generate_from_pdf(save_path)
        if not quiz_deck:
            return jsonify({"success": False, "error": "No flashcards generated from PDF"}), 400

        return jsonify({
            "success": True,
            "quiz_deck": quiz_deck,
            "summary_file": summary_json_path,
            "quiz_file": quiz_json_path,
            "saved_to": save_path
        })
    except Exception as e:
        traceback.print_exc()
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
