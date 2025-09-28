// src/FlashcardShare.jsx
import React, { useState, useMemo } from "react";

export default function FlashcardShare({ shareLink }) {
  const [published, setPublished] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = async () => {
    console.log("Backend URL inside sendEmail:", process.env.REACT_APP_BACKEND_URL);

    if (!published || !email) {
      setStatus("Please publish the set and enter an email.");
      return;
    }

    setStatus("Sending...");

    const backendUrl = process.env.REACT_APP_BACKEND_URL; // <- Render backend URL

    try {
      const res = await fetch("http://localhost:5000/api/send-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, link: shareLink }),
      });

      const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to send email");
        setStatus("Email sent successfully!");
      } catch (err) {
        console.error(err);
        setStatus("Failed to send email. Try again later.");
      }
    };

  return (
    <div className="card mt-4 p-3">
      <div className="form-check form-switch mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="publishSwitch"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="publishSwitch">
          Publish this set (create a shareable link)
        </label>
      </div>

      {published && (
        <div className="input-group mb-3">
          <input
            className="form-control"
            value={shareLink}
            readOnly
          />
        </div>
      )}

      <div className="row g-2 align-items-center">
        <div className="col-sm-7 col-md-6">
          <input
            type="email"
            className="form-control"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-outline-dark"
            onClick={sendEmail}
            disabled={!email || !published}
          >
            Send Email
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-2">
          <small className="text-muted">{status}</small>
        </div>
      )}
    </div>
  );
}