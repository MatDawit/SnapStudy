// src/Flashcards.jsx
import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Flashcards() {
  const { state } = useLocation();
  const incoming = state?.deck || [];

  // Normalize once: ids, topics, keep only term/definition pairs
  const ORIGINAL = useMemo(
    () =>
      incoming
        .map((c, i) => ({
          id: c.id ?? i + 1,
          topic: c.topic || "General",
          term: c.term || c.front || "",
          definition: c.definition || c.back || "",
        }))
        .filter((c) => c.term && c.definition),
    [incoming]
  );

  // If no deck was provided, show a helpful message
  if (ORIGINAL.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="mb-3">Flashcards</h1>
        <p className="text-muted">
          No cards to show. Upload a PDF or create a set first.
        </p>
        <Link to="/uploadfile" className="btn btn-primary">Upload PDF</Link>
      </div>
    );
  }

  // Session state
  const [deck, setDeck] = useState(ORIGINAL);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [status, setStatus] = useState({}); // { [id]: "known" | "unknown" }

  const cur = deck[idx];
  const answered = Object.keys(status).length;
  const progress = Math.round((answered / deck.length) * 100);
  const done = answered === deck.length;

  const mark = (type) => {
    if (status[cur.id]) return; // ignore double-clicks
    setStatus((s) => ({ ...s, [cur.id]: type }));
    setFlip(false);
    setIdx((i) => Math.min(deck.length - 1, i + 1));
  };

  const summary = useMemo(() => {
    const res = { known: {}, review: {} };
    for (const card of deck) {
      const s = status[card.id];
      if (!s) continue;
      const bucket = s === "known" ? "known" : "review";
      res[bucket][card.topic] = (res[bucket][card.topic] || 0) + 1;
    }
    return res;
  }, [deck, status]);

  const restart = () => {
    setDeck(ORIGINAL);
    setIdx(0);
    setFlip(false);
    setStatus({});
  };

  const retakeUnknowns = () => {
    const u = deck.filter((c) => status[c.id] === "unknown");
    if (u.length === 0) return restart();
    setDeck(u);
    setIdx(0);
    setFlip(false);
    setStatus({});
  };

  if (done) {
    const knownCount = Object.values(status).filter((v) => v === "known").length;
    return (
      <div className="container my-4">
        <h2 className="mb-2">Results</h2>
        <p className="text-muted">
          You knew <strong>{knownCount}</strong> / {ORIGINAL.length} cards.
        </p>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-danger-subtle">
              <div className="card-header bg-danger-subtle fw-semibold">Topics to Review</div>
              <ul className="list-group list-group-flush">
                {Object.keys(summary.review).length === 0 && (
                  <li className="list-group-item text-success">None — great job!</li>
                )}
                {Object.entries(summary.review).map(([t, n]) => (
                  <li key={t} className="list-group-item d-flex justify-content-between">
                    <span>{t}</span><span className="badge text-bg-danger">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-success-subtle">
              <div className="card-header bg-success-subtle fw-semibold">Topics You Know</div>
              <ul className="list-group list-group-flush">
                {Object.keys(summary.known).length === 0 && (
                  <li className="list-group-item text-muted">No topics yet.</li>
                )}
                {Object.entries(summary.known).map(([t, n]) => (
                  <li key={t} className="list-group-item d-flex justify-content-between">
                    <span>{t}</span><span className="badge text-bg-success">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-primary" onClick={retakeUnknowns}>Retake Unknowns</button>
          <button className="btn btn-outline-secondary" onClick={restart}>Start Over</button>
          <Link to="/uploadfile" className="btn btn-link">Upload a different PDF</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* progress (top-left) */}
      <div className="d-flex align-items-center gap-3 mb-3" style={{ maxWidth: 260 }}>
        <div className="progress w-100" style={{ height: 10 }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <small className="text-muted">{progress}%</small>
      </div>

      {/* controls + card */}
      <div className="row g-3 align-items-center">
        <div className="col-3 col-sm-2">
          <button className="btn btn-outline-danger w-100" onClick={() => mark("unknown")}>
            I don’t know this
          </button>
        </div>

        <div className="col-6 col-sm-8">
          <div
            className="border rounded-3 p-5 bg-light text-center position-relative"
            style={{ cursor: "pointer", minHeight: 240 }}
            onClick={() => setFlip((f) => !f)}
            title="Tap to flip"
            role="button"
            aria-live="polite"
          >
            <small className="position-absolute top-0 end-0 m-2 text-muted">press to flip</small>
            <div className="fs-2 fw-semibold">
              {flip ? cur.definition : cur.term}
            </div>
            <div className="text-muted mt-2">
              Card {idx + 1} / {deck.length}
            </div>
          </div>
        </div>

        <div className="col-3 col-sm-2 text-end">
          <button className="btn btn-success w-100" onClick={() => mark("known")}>
            I know this
          </button>
        </div>
      </div>
    </div>
  );
}