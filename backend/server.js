// server.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// configure CORS to allow only your frontend origin (update to your GitHub Pages or dev origin)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_ORIGIN,
}));

// transporter using Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,            // hackUMBC2025MPAM@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD,    // app password (16 chars)
  },
});

// simple validation helper
function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

// endpoint to send flashcard link
app.post("/api/send-flashcard", async (req, res) => {
  try {
    const { to, link, subject = "Your SnapStudy Flashcards", text } = req.body;

    if (!to || !link) return res.status(400).json({ error: "Missing to or link" });
    if (!isValidEmail(to)) return res.status(400).json({ error: "Invalid email" });

    const html = `
      <p>Hi —</p>
      <p>Here is the SnapStudy flashcard link you requested:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Best,<br/>SnapStudy</p>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: text || `Here’s your flashcard link: ${link}`,
      html,
    });

    return res.json({ success: true, message: "Email queued/sent" });
  } catch (err) {
    console.error("send-flashcard error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
