from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")])

SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")  # Set in Render
FROM_EMAIL = os.environ.get("GMAIL_USER")  # Verified "From" email in SendGrid

def is_valid_email(email):
    return isinstance(email, str) and "@" in email

@app.route("/api/send-flashcard", methods=["POST"])
def send_flashcard():
    data = request.json
    to_email = data.get("to")
    link = data.get("link")
    subject = data.get("subject", "Your SnapStudy Flashcards")
    text = data.get("text", f"Here’s your flashcard link: {link}")

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
        print("SendGrid error:", e)
        return jsonify({"error": "Failed to send email"}), 500

@app.route("/api/health")
def health():
    return jsonify({"ok": True})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
