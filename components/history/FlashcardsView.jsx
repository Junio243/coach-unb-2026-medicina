import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FlashcardsView({ payload = [], id }) {
  const navigate = useNavigate();
  const [show, setShow] = useState({});
  if (!Array.isArray(payload)) return <div>Nenhum card.</div>;
  return (
    <div className="space-y-3">
      {payload.map((c, i) => (
        <div key={i} className="p-3 bg-slate-100 rounded">
          <div className="font-medium">{c.front}</div>
          {show[i] && <div className="mt-2 text-sm">{c.back}</div>}
          <button
            onClick={() => setShow((s) => ({ ...s, [i]: !s[i] }))}
            className="mt-2 text-indigo-600 text-sm"
          >
            Virar
          </button>
        </div>
      ))}
      <button
        onClick={() => navigate(`/flashcards/${id}`)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Estudar flashcards
      </button>
    </div>
  );
}
