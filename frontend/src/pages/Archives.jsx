import React, { useState } from 'react';

export default function Archives() {
  const [search, setSearch] = useState('');
  const items = [
    'Document 1: Report on Sales',
    'Document 2: Annual Financials',
    'Document 3: Marketing Strategy',
    'Document 4: Project Plan',
    'Document 5: HR Policies',
    'Document 6: Client Feedback',
    'Document 7: Research Notes',
  ];

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="archives-page d-flex flex-column align-items-center">
      <h1 className="cover-heading display-4">Archives</h1>
      <p className="lead text-center">
        Search our archive for documents and records.
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <li key={index} className="list-group-item bg-dark text-white">
              {item}
            </li>
          ))
        ) : (
          <li className="list-group-item bg-dark text-white">
            No results found.
          </li>
        )}
      </ul>
    </div>
  );
}
