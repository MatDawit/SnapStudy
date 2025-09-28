// src/Flashcards.jsx
import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Flashcard from "../components/Flashcard";
import TopicSummary from "../components/TopicSummary";
import FlashcardShare from "../components/FlashcardShare";

export default function Flashcards() {
  const { state } = useLocation();
  const incoming = state?.deck || [];

  // Normalize incoming cards
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

  if (ORIGINAL.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="mb-3">Flashcards</h1>
        <p className="text-muted">No cards to show. Upload a PDF or create a set first.</p>
        <Link to="/uploadfile" className="btn btn-primary">Upload PDF</Link>
      </div>
    );
  }

  // Session state
  const [deck, setDeck] = useState(ORIGINAL);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [status, setStatus] = useState({}); // { [id]: "known" | "unknown" }
  const [meter, setMeter] = useState(50);   // slider (0..100)
  const [showResults, setShowResults] = useState(false);

  const cur = deck[idx];
  const answeredCount = Object.keys(status).length;
  const progressPct = Math.round((answeredCount / deck.length) * 100);
  const done = answeredCount === deck.length;
  const isLast = idx === deck.length - 1;

  const prev = () => {
    setIdx((i) => Math.max(0, i - 1));
    setFlip(false);
    setMeter(50);
  };
  const next = () => {
    // If we’re on the last card AND all cards are marked, show Results
    if (isLast && done) {
      setShowResults(true);
      return;
    }
    setIdx((i) => Math.min(deck.length - 1, i + 1));
    setFlip(false);
    setMeter(50);
  };

  const mark = (type) => {
    if (status[cur.id]) return;     // don’t double-mark
    setStatus((s) => ({ ...s, [cur.id]: type }));
    setFlip(false);
    setMeter(50);
    // auto-advance unless already at last card
    if (!isLast) setIdx((i) => Math.min(deck.length - 1, i + 1));
  };

  // Commit slider on release: full left = unknown, full right = known
  const commitMeter = (val) => {
    if (val <= 10) return mark("unknown");
    if (val >= 90) return mark("known");
  };

  const restart = () => {
    setDeck(ORIGINAL);
    setIdx(0);
    setFlip(false);
    setStatus({});
    setMeter(50);
    setShowResults(false);
  };

  const retakeUnknowns = () => {
    const unknowns = deck.filter((c) => status[c.id] === "unknown");
    if (unknowns.length === 0) return restart();
    setDeck(unknowns);
    setIdx(0);
    setFlip(false);
    setStatus({});
    setMeter(50);
    setShowResults(false);
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

  /** Share link + email state */
  const shareLink = useMemo(() => {
    try {
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(ORIGINAL))));
      return `${window.location.origin}/flashcards#deck=${b64}`;
    } catch {
      return `${window.location.origin}/flashcards`;
    }
  }, [ORIGINAL]);

  const [published, setPublished] = useState(false);
  const [email, setEmail] = useState("");

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareLink); } catch {}
  };
  const emailMe = () => {
    const subject = "Your SnapStudy Flashcards";
    const body = `Here’s your flashcard link:\n\n${shareLink}`;
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  /** Results screen */
  if (done || showResults) {
    const knownCount = Object.values(status).filter((v) => v === "known").length;

    return (
      <div className="container my-4">
        <h2 className="mb-2">Results</h2>
        <p className="text-muted">
          You knew <strong>{knownCount}</strong> / {ORIGINAL.length} cards.
        </p>

        <div className="row g-4">
          <TopicSummary title="Topics to Review" data={summary.review} variant="danger" />
          <TopicSummary title="Topics You Know" data={summary.known} variant="success" />
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-primary" onClick={retakeUnknowns}>Retake Unknowns</button>
          <button className="btn btn-outline-secondary" onClick={restart}>Start Over</button>
          <Link to="/uploadfile" className="btn btn-link">Upload a different PDF</Link>
        </div>

        {/* Sharing */}
        <div className="card mt-4">
          <div className="card-body">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
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
                <input className="form-control" value={shareLink} readOnly />
                <button className="btn btn-outline-primary" onClick={copyLink}>Copy link</button>
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
                  onClick={emailMe}
                  disabled={!email || !published}
                >
                  Email me this link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** Study screen (simpler look) */
  return (
    <div className="container my-4" style={{ maxWidth: 980 }}>
      {/* short progress bar (~2in) top-left */}
      <div className="mb-3" style={{ width: "2in" }}>
        <div className="progress" style={{ height: 6 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progressPct}%` }}
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* bigger, simpler card (text forced to black) */}
      <div className="mx-auto mb-3" style={{ maxWidth: 960 }}>
        <div className="border rounded-3 bg-white p-0" style={{ minHeight: 420 }}>
          <div
            className="p-5 text-center text-dark"
            style={{ color: "#000" }}
            role="button"
            onClick={() => setFlip((f) => !f)}
            title="Tap to flip"
          >
            <Flashcard card={cur} flip={flip} idx={idx} total={deck.length} />
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary" onClick={prev} disabled={idx === 0}>
          ← Previous
        </button>
        <div className="text-muted small">Card {idx + 1} / {deck.length}</div>
        <button
          className="btn btn-outline-secondary"
          onClick={next}
          disabled={isLast && !done}  // enable on last card only after it’s marked
        >
          {isLast && done ? "See Results →" : "Next →"}
        </button>
      </div>

      {/* Slider meter (no helper text) */}
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <div className="d-flex justify-content-between mb-1">
          <span style={{ fontFamily: '"Comic Sans MS","Comic Sans",cursive' }}>
            I don’t know this
          </span>
          <span style={{ fontFamily: '"Comic Sans MS","Comic Sans",cursive' }}>
            I know this
          </span>
        </div>
        <input
          type="range"
          className="form-range"
          min={0}
          max={100}
          step={1}
          value={meter}
          onChange={(e) => setMeter(Number(e.target.value))}
          onMouseUp={(e) => commitMeter(Number(e.currentTarget.value))}
          onTouchEnd={() => commitMeter(meter)}
        />
      </div>
    </div>
  );
}
