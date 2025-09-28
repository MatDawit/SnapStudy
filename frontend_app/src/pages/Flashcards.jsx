// src/Flashcards.jsx
import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import TopicSummary from "../components/TopicSummary";

export default function Flashcards() {
  const { state } = useLocation();
  const savedDecks = JSON.parse(localStorage.getItem("savedDecks") || "[]");
  

  // Get initial cards from state
  const incoming = state?.deck || [];

  // Sanitize helper
  const sanitize = (str) =>
    str ? str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n") : "";

  // Remove duplicates and normalize
  const ORIGINAL = useMemo(() => {
    if (!incoming || incoming.length === 0) return [];

    const seen = new Set();
    const uniqueCards = [];

    incoming.forEach((c, i) => {
      const term = sanitize(c.term || c.practice_question);
      const definition = sanitize(c.definition || c.answer);
      const key = `${term}||${definition}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueCards.push({
          id: c.id || i + 1,
          topic: sanitize(c.topic || "General"),
          term,
          definition,
        });
      }
    });

    return uniqueCards;
  }, [incoming]);

  if (ORIGINAL.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="mb-3">Flashcards</h1>
        <p className="text-white">No cards to show. Upload a PDF or create a set first.</p>
        <Link to="/uploadfile" className="btn btn-light">Upload PDF</Link>
      </div>
    );
  }

  // State
  const [deck, setDeck] = useState(ORIGINAL);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [status, setStatus] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [progressCount, setProgressCount] = useState(0);

  const cur = deck[idx];
  const isLast = idx === deck.length - 1;
  const progressPct = Math.round((progressCount / deck.length) * 100);

  // Save deck states
  const [saveName, setSaveName] = useState(state?.deck_title || "My Flashcards");
  const [saved, setSaved] = useState(false);

  // Actions
  const prev = () => { setIdx(i => Math.max(0, i - 1)); setFlip(false); };
  const next = () => {
    if (isLast) { setProgressCount(deck.length); setShowResults(true); return; }
    setIdx(i => Math.min(deck.length - 1, i + 1)); setFlip(false);
    setProgressCount(c => Math.min(deck.length, c + 1));
  };
  const mark = (type) => setStatus(s => ({ ...s, [cur.id]: type }));
  const restart = () => { setDeck(ORIGINAL); setIdx(0); setFlip(false); setStatus({}); setShowResults(false); setProgressCount(0); };
  const retakeUnknowns = () => {
    const unknowns = deck.filter(c => status[c.id] === "unknown");
    if (!unknowns.length) return restart();
    setDeck(unknowns); setIdx(0); setFlip(false); setStatus({}); setShowResults(false); setProgressCount(0);
  };
  const handleSaveDeck = () => {
  if (!saveName.trim()) return;
  const slug = saveName.replace(/\s+/g, "-").toLowerCase();
  let savedDecks = JSON.parse(localStorage.getItem("savedDecks") || "[]");

  // Remove existing deck with same slug to avoid duplicates
  savedDecks = savedDecks.filter(d => d.slug !== slug);

  savedDecks.push({
    name: saveName,
    date: new Date().toISOString(),
    cards: ORIGINAL,
    slug
  });

  localStorage.setItem("savedDecks", JSON.stringify(savedDecks));
  setSaved(true);
};

  // Results data
  const summary = useMemo(() => {
  const res = { known: {}, review: {} };
  for (const card of deck) {
    const s = status[card.id];
    if (!s) continue;

    if (s === "known") {
      // Known cards → "Topics You Know"
      res.known[card.term] = (res.known[card.term] || 0) + 1;
    } else if (s === "unknown") {
      // Unknown cards → "Topics to Review"
      res.review[card.term] = (res.review[card.term] || 0) + 1;
    }
  }
  return res;
}, [deck, status]);


  // Results screen
  if (showResults) {
    const knownCount = Object.values(status).filter(v => v === "known").length;

    return (
      <div className="container my-4">
        <h2 className="mb-2">Results</h2>
        <p className="text-white">You knew <strong>{knownCount}</strong> / {ORIGINAL.length} cards.</p>

        <div className="row g-4">
          <TopicSummary title="Topics to Review" data={summary.review} variant="danger" />
          <TopicSummary title="Topics You Know" data={summary.known} variant="success" />
        </div>

        {/* Save deck section */}
        <div className="mt-4 p-3 border rounded">
          <h5>Save this deck to your archives</h5>
          {saved ? (
            <p className="text-success">Deck saved successfully!</p>
          ) : (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                placeholder="Enter deck name"
              />
              <button className="btn btn-light" onClick={handleSaveDeck}>Save Deck</button>
            </>
          )}
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-light" onClick={retakeUnknowns}>Retake Unknowns</button>
          <button className="btn btn-outline-light" onClick={restart}>Start Over</button>
          <Link to="/uploadfile" className="btn btn-outline-light">Upload a different PDF</Link>
        </div>
      </div>
    );
  }

  // Study screen
  return (
    <>
      <style>{`
        .flip-scene { perspective: 1000px; }
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
        <div className="mb-3" style={{ width: "2in" }}>
          <div className="progress" style={{ height: 6 }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${progressPct}%` }} aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}/>
          </div>
        </div>

        <div className="mx-auto mb-3" style={{ maxWidth: 960 }}>
          <div className="border rounded-3 bg-white" style={{ minHeight: 420 }}>
            <div className="p-5 text-center text-dark">
              <div className="flip-scene" role="button" title="Tap to flip" onClick={() => setFlip(f => !f)} aria-pressed={flip}>
                <div className={`flip-card ${flip ? "is-flipped" : ""}`}>
                  <div className="flip-face"><div className="fs-1 fw-semibold">{cur.term}</div></div>
                  <div className="flip-face flip-back"><div className="fs-1 fw-semibold">{cur.definition}</div></div>
                </div>
              </div>
              <div className="text-muted mt-3">Card {idx + 1} / {deck.length}</div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light border text-dark" onClick={prev} disabled={idx === 0}>← Previous</button>
            <button type="button" className={status[cur.id] === "unknown" ? "btn btn-danger text-white" : "btn btn-light border text-dark"} onClick={() => mark("unknown")}>I don’t know this</button>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button type="button" className={status[cur.id] === "known" ? "btn btn-success text-white" : "btn btn-light border text-dark"} onClick={() => mark("known")}>I know this</button>
            <button className="btn btn-light border text-dark" onClick={next}>Next →</button>
          </div>
        </div>
      </div>
    </>
  );
}