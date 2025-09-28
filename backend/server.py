from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")])

GMAIL_USER = os.environ.get("GMAIL_USER")  # hackUMBC2025MPAM@gmail.com
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD")

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
        return jsonify({"error": "Missing to or link"}), 400
    if not is_valid_email(to_email):
        return jsonify({"error": "Invalid email"}), 400

    # Create email
    msg = MIMEMultipart()
    msg["From"] = GMAIL_USER
    msg["To"] = to_email
    msg["Subject"] = subject

    html = f"""
    <p>Hi —</p>
    <p>Here is the SnapStudy flashcard link you requested:</p>
    <p><a href="{link}">{link}</a></p>
    <p>Best,<br/>SnapStudy</p>
    """

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, to_email, msg.as_string())
        return jsonify({"success": True, "message": "Email sent"})
    except Exception as e:
        print("send-flashcard error:", e)
        return jsonify({"error": "Failed to send email"}), 500

@app.route("/api/health")
def health():
    return jsonify({"ok": True})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
