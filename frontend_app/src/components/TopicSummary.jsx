import React from "react";

export default function TopicSummary({ title, data, variant }) {
  return (
    <div className="col-md-6">
      <div className={`card border-${variant}-subtle`}>
        <div className={`card-header bg-${variant}-subtle fw-semibold`}>{title}</div>
        <ul className="list-group list-group-flush">
          {Object.keys(data).length === 0 ? (
            <li className="list-group-item text-muted">None</li>
          ) : (
            Object.entries(data).map(([topic, count]) => (
              <li key={topic} className="list-group-item d-flex justify-content-between">
                <span>{topic}</span>
                <span className={`badge text-bg-${variant}`}>{count}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
