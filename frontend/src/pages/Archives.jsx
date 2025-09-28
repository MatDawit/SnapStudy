// src/Archives.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Archives() {
  const [search, setSearch] = useState('');
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  // Load saved decks from localStorage
  
  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
    // Sort by newest first
    setDecks(savedDecks.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

// ✅ NEW CODE (calls backend instead of localStorage)

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(search.toLowerCase())
  );

/*
// Fetch all decks once
useEffect(() => {
  const fetchDecks = async () => {
    try {
      const response = await fetch("/api/decks");
      const data = await response.json();
      setDecks(data);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };
  fetchDecks();
}, []);
*/
// Then filter locally

  const handleViewDeck = (deck) => {
    navigate(`/flashcards/${deck.slug}`, { state: { deck: deck.cards, deck_title: deck.name } });
  };


  return (
    <div className="archives-page d-flex flex-column align-items-center py-5">
      <h1 className="cover-heading display-4 mb-3">Archives</h1>
      <p className="lead text-center mb-4">
        Search and view your previously saved flashcard decks
      </p>

      <div className="mb-3 w-100" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search archives..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="list-group w-100" style={{ maxWidth: '500px' }}>
        {filteredDecks.length > 0 ? (
          filteredDecks.map((deck, index) => (
            <li
            key={deck.slug}
            className="list-group-item list-group-item-action bg-dark text-white d-flex justify-content-between align-items-center"
            role="button"
            onClick={() => handleViewDeck(deck)}
          >
            <span>{deck.name}</span>
            <small className="text-muted">{new Date(deck.date).toLocaleDateString()}</small>
          </li>
          ))
        ) : (
          <li className="list-group-item bg-transparent text-white">
            No results found.
          </li>
        )}
      </ul>

      {decks.length === 0 && (
        <p className="text-white mt-3">There are no decks currently in archives!</p>
      )}
    </div>
  );
}
