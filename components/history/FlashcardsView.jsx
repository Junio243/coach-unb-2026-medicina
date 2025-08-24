import React, { useState } from 'react';

export default function FlashcardsView({ payload = [] }) {
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
    </div>
  );
}
