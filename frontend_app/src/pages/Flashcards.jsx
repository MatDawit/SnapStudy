// src/Flashcards.jsx
import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import TopicSummary from "../components/TopicSummary";

export default function Flashcards() {
  const { state } = useLocation();
  const savedDecks = JSON.parse(localStorage.getItem("savedDecks") || "[]");
  

  // Get initial cards from state or sessionStorage fallback
  const incoming = useMemo(() => {
    // First try to get from navigation state
    if (state?.deck && state.deck.length > 0) {
      return state.deck;
    }
    
    // Fallback to sessionStorage (from recent upload/generation)
    try {
      const lastDeck = sessionStorage.getItem('lastDeck');
      if (lastDeck) {
        const parsed = JSON.parse(lastDeck);
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse lastDeck from sessionStorage:', e);
    }
    
    return [];
  }, [state?.deck]);

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
  const [saveName, setSaveName] = useState(() => {
    // Try to get deck title from navigation state first
    if (state?.deck_title) {
      return state.deck_title;
    }
    
    // Fallback to sessionStorage
    try {
      const lastDeckTitle = sessionStorage.getItem('lastDeckTitle');
      if (lastDeckTitle) {
        return lastDeckTitle;
      }
    } catch (e) {
      console.warn('Could not get lastDeckTitle from sessionStorage:', e);
    }
    
    return "My Flashcards";
  });
  
  // Check if this deck already exists in archives
  const existingDeck = useMemo(() => {
    const savedDecks = JSON.parse(localStorage.getItem("savedDecks") || "[]");
    return savedDecks.find(deck => 
      deck.cards && 
      deck.cards.length === ORIGINAL.length &&
      deck.cards.every((card, index) => 
        card.term === ORIGINAL[index]?.term && 
        card.definition === ORIGINAL[index]?.definition
      )
    );
  }, [ORIGINAL]);

  const [saved, setSaved] = useState(!!existingDeck);
  
  // Update save name if deck exists in archives
  React.useEffect(() => {
    if (existingDeck) {
      setSaveName(existingDeck.name);
    }
  }, [existingDeck]);

  // Keep sessionStorage updated with current deck data
  React.useEffect(() => {
    if (ORIGINAL.length > 0) {
      sessionStorage.setItem("lastDeck", JSON.stringify(ORIGINAL));
      sessionStorage.setItem("lastDeckTitle", saveName);
    }
  }, [ORIGINAL, saveName]);

  // Email sharing states
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

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
  // Add state for duplicate handling
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateDeck, setDuplicateDeck] = useState(null);

  const handleSaveDeck = () => {
    if (!saveName.trim()) return;
    
    const trimmedName = saveName.trim();
    let savedDecks = JSON.parse(localStorage.getItem("savedDecks") || "[]");
    
    // Check for existing deck with same name (case-insensitive)
    const existingDeck = savedDecks.find(d => 
      d.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingDeck) {
      // Show duplicate confirmation modal
      setDuplicateDeck(existingDeck);
      setShowDuplicateModal(true);
      return;
    }

    // Save the deck if no duplicates
    saveDeckToStorage(trimmedName, savedDecks);
  };

  const saveDeckToStorage = (deckName, savedDecks = null) => {
    if (!savedDecks) {
      savedDecks = JSON.parse(localStorage.getItem("savedDecks") || "[]");
    }

    const slug = deckName.replace(/\s+/g, "-").toLowerCase();
    
    // Remove any existing deck with same name/slug
    savedDecks = savedDecks.filter(d => 
      d.name.toLowerCase() !== deckName.toLowerCase() && d.slug !== slug
    );

    savedDecks.push({
      name: deckName,
      date: new Date().toISOString(),
      cards: ORIGINAL,
      slug
    });

    localStorage.setItem("savedDecks", JSON.stringify(savedDecks));
    setSaved(true);
    setShowDuplicateModal(false);
  };

  const handleReplaceDeck = () => {
    saveDeckToStorage(saveName.trim());
  };

  const handleRenameDeck = () => {
    const timestamp = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const newName = `${saveName.trim()} (${timestamp})`;
    setSaveName(newName);
    saveDeckToStorage(newName);
  };

  const handleSendEmail = async () => {
    // Check if deck has been saved or exists in archives
    if (!saved && !existingDeck) {
      setEmailError("Please save the deck first before sending via email");
      return;
    }

    if (!emailAddress.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!emailAddress.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailSending(true);
    setEmailError("");

    try {
      const knownCount = Object.values(status).filter(v => v === "known").length;
      const unknownCount = Object.values(status).filter(v => v === "unknown").length;
      const progressPercent = Math.round((knownCount / ORIGINAL.length) * 100);

      // Determine backend URL - use production URL when deployed to GitHub Pages
      const getBackendUrl = () => {
        // If deployed to GitHub Pages (production), use Render URL
        if (window.location.hostname === 'matdawit.github.io') {
          return 'https://snapstudy-rgtp.onrender.com';
        }
        // Otherwise use environment variable or localhost for development
        return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      };
      
      const backendUrl = getBackendUrl();
      console.log('Detected hostname:', window.location.hostname);
      console.log('Using backend URL:', backendUrl);
      
      const response = await fetch(`${backendUrl}/api/send-session-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailAddress,
          flashcards: ORIGINAL,
          deck_title: saveName, // Use the saved deck name
          session_stats: {
            total_cards: ORIGINAL.length,
            known_count: knownCount,
            unknown_count: unknownCount,
            progress_percent: progressPercent
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
        setEmailAddress("");
      } else {
        setEmailError(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Email sending error:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setEmailError("Cannot connect to backend server. Please check if it's running.");
      } else if (error.message.includes('CORS')) {
        setEmailError("CORS error - please check backend configuration.");
      } else {
        setEmailError(`Network error: ${error.message}. Please try again.`);
      }
    } finally {
      setEmailSending(false);
    }
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
          {existingDeck ? (
            <div className="alert alert-info" role="alert">
              <strong>📁 Already in Archives:</strong> This deck exists as "{existingDeck.name}"
            </div>
          ) : saved ? (
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

        {/* Email sharing section */}
        <div className="mt-4 p-3 border rounded">
          <h5>📧 Email your flashcards & results</h5>
          <p className="text-muted small">Send your complete flashcard set and session results to any email address</p>
          
          {!saved && !existingDeck ? (
            <div className="alert alert-warning" role="alert">
              <strong>⚠️ Save Required:</strong> Please save this deck to your archives first before sending via email.
            </div>
          ) : emailSent ? (
            <div className="alert alert-success" role="alert">
              <strong>✅ Email sent successfully!</strong> Your flashcard deck "{saveName}" has been delivered.
            </div>
          ) : (
            <>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                  disabled={emailSending || (!saved && !existingDeck)}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleSendEmail}
                  disabled={emailSending || !emailAddress.trim() || (!saved && !existingDeck)}
                >
                  {emailSending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Email'
                  )}
                </button>
              </div>
              
              {emailError && (
                <div className="alert alert-danger" role="alert">
                  {emailError}
                </div>
              )}
              
              <small className="text-muted">
                Will send "{saveName}" with {ORIGINAL.length} flashcards, your session progress ({Math.round((Object.values(status).filter(v => v === "known").length / ORIGINAL.length) * 100)}% mastered), and detailed results.
              </small>
            </>
          )}
        </div>

        {/* Duplicate Name Confirmation Modal */}
        {showDuplicateModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-dark">⚠️ Duplicate Deck Name</h5>
                </div>
                <div className="modal-body text-dark">
                  <p>A flashcard set named <strong>"{saveName}"</strong> already exists in your archives.</p>
                  <p>What would you like to do?</p>
                  
                  {duplicateDeck && (
                    <div className="alert alert-info">
                      <small>
                        <strong>Existing deck:</strong> "{duplicateDeck.name}"<br/>
                        <strong>Created:</strong> {new Date(duplicateDeck.date).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDuplicateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={handleReplaceDeck}
                  >
                    Replace Existing
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleRenameDeck}
                  >
                    Save with Timestamp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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