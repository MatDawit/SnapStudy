import React from "react";
import "../styles/Flashcard.css"; 

export default function Flashcard({ card, flip, onFlip, idx, total }) {
  return (
    <div className="flashcard-container my-3">
      <div className={`flashcard ${flip ? "flipped" : ""}`} onClick={onFlip}>
        <div className="front">
          <div className="card-content">
            <div className="fs-2 fw-semibold">{card.term}</div>
            <div className="text-muted mt-2">Card {idx + 1} / {total}</div>
          </div>
        </div>
        <div className="back">
          <div className="card-content">
            <div className="fs-2 fw-semibold">{card.definition}</div>
            <div className="text-muted mt-2">Card {idx + 1} / {total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
