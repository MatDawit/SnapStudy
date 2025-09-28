import React from "react";

export default function FlashcardControls({ onKnown, onUnknown, onRestart }) {
  return (
    <div className="row g-3 align-items-center my-3">
      <div className="col-3 col-sm-2">
        <button className="btn btn-outline-danger w-100" onClick={onUnknown}>I don’t know this</button>
      </div>
      <div className="col-3 col-sm-2 text-end">
        <button className="btn btn-success w-100" onClick={onKnown}>I know this</button>
      </div>
      <div className="col-6 col-sm-8 text-center">
        <button className="btn btn-outline-secondary" onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}
