// src/Flashcards.jsx
import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import TopicSummary from "../components/TopicSummary";
import FlashcardShare from "../components/FlashcardShare";

export default function Flashcards() {
  const { state } = useLocation();
  const incoming = state?.deck || JSON.parse(sessionStorage.getItem("lastDeck") || "[]");

  // Normalize deck
  const ORIGINAL = useMemo(() => {
    if (Array.isArray(incoming)) {
      return incoming.map((c, i) => ({
        id: c.id || i + 1,
        topic: c.topic || "General",
        term: c.term || c.practice_question,
        definition: c.definition || c.answer,
      }));
    }
    // fallback if incoming has .qa_pairs
    return (incoming.qa_pairs || []).map((c, i) => ({
      id: i + 1,
      topic: incoming.deck_title || "General",
      term: c.practice_question,
      definition: c.answer,
    }));
  }, [incoming]);

  if (ORIGINAL.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="mb-3">Flashcards</h1>
        <p className="text-muted">No cards to show. Upload a PDF or create a set first.</p>
        <Link to="/uploadfile" className="btn btn-primary">Upload PDF</Link>
      </div>
    );
  }

  // State
  const [deck, setDeck] = useState(ORIGINAL);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [status, setStatus] = useState({});          // { [id]: "known" | "unknown" }
  const [showResults, setShowResults] = useState(false);
  const [progressCount, setProgressCount] = useState(0); // advances only on Next

  const cur = deck[idx];
  const isLast = idx === deck.length - 1;
  const progressPct = Math.round((progressCount / deck.length) * 100);

  // Button class helper (white by default, green/red when selected)
  const idkSelected = status[cur.id] === "unknown";
  const ikSelected  = status[cur.id] === "known";
  const idkBtnClass = idkSelected ? "btn btn-danger text-white" : "btn btn-light border text-dark";
  const ikBtnClass  = ikSelected  ? "btn btn-success text-white" : "btn btn-light border text-dark";

  // Actions
  const prev = () => {
    setIdx((i) => Math.max(0, i - 1));
    setFlip(false);
    // progress does NOT change on Prev
  };

  const next = () => {
    if (isLast) {
      setProgressCount(deck.length); // fill bar on last Next
      setShowResults(true);
      return;
    }
    setIdx((i) => Math.min(deck.length - 1, i + 1));
    setFlip(false);
    setProgressCount((c) => Math.min(deck.length, c + 1)); // +1 per Next press
  };

  const mark = (type) => {
    // Record choice only; do not auto-advance
    setStatus((s) => ({ ...s, [cur.id]: type }));
  };

  const restart = () => {
    setDeck(ORIGINAL);
    setIdx(0);
    setFlip(false);
    setStatus({});
    setShowResults(false);
    setProgressCount(0); // reset progress bar
  };

  const retakeUnknowns = () => {
    const unknowns = deck.filter((c) => status[c.id] === "unknown");
    if (unknowns.length === 0) return restart(); // restart already resets progress
    setDeck(unknowns);
    setIdx(0);
    setFlip(false);
    setStatus({});
    setShowResults(false);
    setProgressCount(0); // reset progress for new run
  };

  // Results data
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

  // Share link (hash-encodes deck; works without backend)
  const shareLink = useMemo(() => {
    try {
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(ORIGINAL))));
      return `${window.location.origin}/flashcards#deck=${b64}`;
    } catch {
      return `${window.location.origin}/flashcards`;
    }
  }, [ORIGINAL]);

  // Results screen (only after pressing Next on last card)
  if (showResults) {
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

        <FlashcardShare shareLink={shareLink} />
      </div>
    );
  }

  // Study screen
  return (
    <>
      {console.log("Incoming state:", state)}
      {console.log("ORIGINAL:", ORIGINAL)}

      {/* Flip animation styles (scoped) */}
      <style>{`.flip-scene { perspective: 1000px; }
        .flip-card {
          position: relative;
          width: 100%;
          min-height: 260px;
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(.2,.6,.2,1);
          cursor: pointer;
        }
        .flip-card.is-flipped { transform: rotateY(180deg); }
        .flip-face {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          backface-visibility: hidden;
        }
        .flip-back { transform: rotateY(180deg); }
      `}</style>
      <div className="container my-4" style={{ maxWidth: 980 }}>
        {/* Short progress bar (~2in), top-left; moves only on Next */}
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

        {/* Big white rectangle (no inner rectangle) */}
        <div className="mx-auto mb-3" style={{ maxWidth: 960 }}>
          <div className="border rounded-3 bg-white" style={{ minHeight: 420 }}>
            <div className="p-5 text-center text-dark" style={{ color: "#000" }}>
              {/* Flip scene */}
              <div
                className="flip-scene"
                role="button"
                title="Tap to flip"
                onClick={() => setFlip((f) => !f)}
                aria-pressed={flip}
              >
                <div className={`flip-card ${flip ? "is-flipped" : ""}`}>
                  {/* Front */}
                  <div className="flip-face">
                    <div className="fs-1 fw-semibold">{cur.term}</div>
                  </div>
                  {/* Back */}
                  <div className="flip-face flip-back">
                    <div className="fs-1 fw-semibold">{cur.definition}</div>
                  </div>
                </div>
              </div>

              <div className="text-muted mt-3">Card {idx + 1} / {deck.length}</div>
            </div>
          </div>
        </div>

        {/* Controls (white buttons by default):
            Left:  [Prev]  [I don’t know this (red on select)]
            Right: [I know this (green on select)]  [Next] */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-light border text-dark"
              onClick={prev}
              disabled={idx === 0}
            >
              ← Previous
            </button>

            <button
              type="button"
              className={idkBtnClass}
              onClick={() => mark("unknown")}
              aria-pressed={idkSelected}
            >
              I don’t know this
            </button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={ikBtnClass}
              onClick={() => mark("known")}
              aria-pressed={ikSelected}
            >
              I know this
            </button>

            <button
              className="btn btn-light border text-dark"
              onClick={next}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}