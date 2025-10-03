// File: src/Archives.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SAVED_KEY = 'savedDecks';
const BACKUP_KEY = 'savedDecksBackup'; // { decks, ts }

/** Read decks from localStorage safely. */
function readSavedDecks() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Persist decks to localStorage. */
function writeSavedDecks(decks) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(decks ?? []));
  } catch {}
}

/** Keep a temporary backup for Undo. */
function backupSavedDecks(decks) {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify({ decks, ts: Date.now() }));
  } catch {}
}

/** Read temporary backup if any. */
function readBackup() {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    return JSON.parse(raw || 'null');
  } catch {
    return null;
  }
}

/** Drop temporary backup. */
function clearBackup() {
  try {
    localStorage.removeItem(BACKUP_KEY);
  } catch {}
}

/** Full wipe for session reset. WHY: hard clean slate across the site. */
function clearAllStorage() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}
}

/** Build a readable compact label for diverse card schemas. */
function cardLabel(card, idx) {
  if (!card || typeof card !== 'object') return `Card #${idx + 1}`;
  const front =
    card.front ?? card.term ?? card.question ?? card.prompt ?? card.q ??
    card.title ?? card.word ?? card.key ?? card.text;
  const back =
    card.back ?? card.definition ?? card.answer ?? card.response ?? card.a ?? card.value;
  const left = String(front ?? `Card #${idx + 1}`);
  return back ? `${left} — ${String(back)}` : left;
}

export default function Archives() {
  const [search, setSearch] = useState('');
  const [decks, setDecks] = useState([]);
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [undo, setUndo] = useState({ active: false, msg: '' });
  const undoTimerId = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = readSavedDecks();
    setDecks([...saved].sort((a, b) => new Date(b.date) - new Date(a.date)));

    const pending = readBackup();
    if (pending && Array.isArray(pending.decks)) {
      setUndo({ active: true, msg: 'Archives cleared. Undo?' });
      if (undoTimerId.current) clearTimeout(undoTimerId.current);
      undoTimerId.current = setTimeout(finalizeClear, 10000);
    }
    return () => {
      if (undoTimerId.current) clearTimeout(undoTimerId.current);
    };
  }, []);

  const filteredDecks = decks.filter((deck) =>
    (deck?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDeck = (deck) => {
    navigate(`/flashcards/${deck.slug}`, {
      state: { deck: deck.cards, deck_title: deck.name },
    });
  };

  const handleClearArchivesSoft = () => {
    if (!decks.length) return;
    const ok = window.confirm(
      'This will delete all archived decks on this device. You can Undo within 10 seconds. Continue?'
    );
    if (!ok) return;

    backupSavedDecks(decks);
    writeSavedDecks([]); // soft clear
    setDecks([]);
    setExpandedSlug(null);
    setUndo({ active: true, msg: 'Archives cleared. Undo?' });

    if (undoTimerId.current) clearTimeout(undoTimerId.current);
    undoTimerId.current = setTimeout(finalizeClear, 10000);
  };

  function finalizeClear() {
    clearBackup(); // finalize deletion after the undo window
    setUndo({ active: false, msg: '' });
    undoTimerId.current = null;
  }

  const handleUndoClear = () => {
    const b = readBackup();
    if (!b || !Array.isArray(b.decks)) {
      setUndo({ active: false, msg: '' });
      return;
    }
    writeSavedDecks(b.decks);
    setDecks([...b.decks].sort((a, c) => new Date(c.date) - new Date(a.date)));
    setUndo({ active: false, msg: '' });
    if (undoTimerId.current) clearTimeout(undoTimerId.current);
    clearBackup();
  };

  const handleResetAll = () => {
    const ok = window.confirm(
      'This will clear ALL local+session data for this site and refresh. Continue?'
    );
    if (!ok) return;
    clearAllStorage();
    window.location.reload(); // ensure a fresh boot
  };

  const toggleExpand = (slug) => {
    setExpandedSlug((s) => (s === slug ? null : slug));
  };

  const handleRemoveCard = (deckSlug, cardIndex) => {
    const dIdx = decks.findIndex((d) => d.slug === deckSlug);
    if (dIdx === -1) return;
    const deck = decks[dIdx];
    const label = cardLabel(deck.cards?.[cardIndex], cardIndex);
    const ok = window.confirm(`Remove this flashcard?\n\n${label}`);
    if (!ok) return;

    const newDecks = decks
      .map((d) => {
        if (d.slug !== deckSlug) return d;
        const nextCards = Array.isArray(d.cards)
          ? d.cards.filter((_, i) => i !== cardIndex)
          : [];
        const updated = { ...d, cards: nextCards };
        return nextCards.length ? updated : null; // drop empty deck
      })
      .filter(Boolean);

    writeSavedDecks(newDecks);
    setDecks(newDecks);
    if (!newDecks.find((d) => d.slug === deckSlug)) setExpandedSlug(null);
  };

  return (
    <div className="archives-page d-flex flex-column align-items-center py-5 position-relative">
      {/* Header (no action buttons here per request) */}
      <div className="mb-3 w-100" style={{ maxWidth: '700px' }}>
        <h1 className="cover-heading display-4 mb-1">Archives</h1>
        <p className="lead mb-0">Search and manage your previously saved flashcard decks</p>
      </div>

      {/* Search */}
      <div className="mb-3 w-100" style={{ maxWidth: '700px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search archives..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Deck list */}
      <ul className="list-group w-100" style={{ maxWidth: '700px' }}>
        {filteredDecks.length > 0 ? (
          filteredDecks.map((deck) => {
            const dateStr = new Date(deck.date).toLocaleDateString();
            const count = deck.cards?.length ?? 0;
            return (
              <li key={deck.slug} className="list-group-item bg-dark text-white">
                {/* Tight, baseline-aligned row: title/meta left, actions right */}
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-2 min-w-0">
                      <span className="fw-semibold text-truncate">{deck.name}</span>
                      <small className="text-muted text-nowrap">
                        · {dateStr} · {count} {count === 1 ? 'card' : 'cards'}
                      </small>
                    </div>
                  </div>
                  <div className="btn-group btn-group-sm" role="group" aria-label="Deck Actions">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => handleViewDeck(deck)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={() => toggleExpand(deck.slug)}
                    >
                      {expandedSlug === deck.slug ? 'Hide' : 'Manage'}
                    </button>
                  </div>
                </div>

                {/* Expanded card management */}
                {expandedSlug === deck.slug && (
                  <div className="mt-3">
                    {Array.isArray(deck.cards) && deck.cards.length ? (
                      <ul className="list-group">
                        {deck.cards.map((card, idx) => (
                          <li
                            key={`${deck.slug}-${idx}`}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span className="text-dark text-truncate">{cardLabel(card, idx)}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveCard(deck.slug, idx)}
                              title="Remove this flashcard"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">No cards in this deck.</div>
                    )}
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <li className="list-group-item bg-transparent text-white">No results found.</li>
        )}
      </ul>

      {decks.length === 0 && (
        <p className="text-white mt-3">There are no decks currently in archives!</p>
      )}

      {/* Actions moved BELOW all flashcards */}
      <div
        className="d-flex gap-2 mt-4 w-100 justify-content-end"
        style={{ maxWidth: '700px' }}
      >
        <button
          type="button"
          className="btn btn-outline-danger"
          title="Soft delete all archives with Undo (10s)"
          onClick={handleClearArchivesSoft}
          disabled={!decks.length}
        >
          Clear Archives
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          title="Clear all local+session storage and refresh"
          onClick={handleResetAll}
        >
          Reset Session
        </button>
      </div>

      {/* Undo Toast */}
      {undo.active && (
        <div
          className="position-fixed p-3"
          style={{ right: 16, bottom: 16, zIndex: 1080, maxWidth: 400 }}
        >
          <div className="toast show align-items-center text-bg-dark border-0">
            <div className="d-flex">
              <div className="toast-body">{undo.msg}</div>
              <button
                type="button"
                className="btn btn-sm btn-light m-2"
                onClick={handleUndoClear}
                title="Restore your archives"
              >
                Undo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
