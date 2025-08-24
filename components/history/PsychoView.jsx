import React from 'react';

export default function PsychoView({ payload }) {
  if (!payload) return null;
  return (
    <div className="space-y-3 text-sm">
      {payload.summary && <p>{payload.summary}</p>}
      {payload.interventions && (
        <div className="space-y-2">
          {payload.interventions.map((i, idx) => (
            <div key={idx} className="p-2 bg-slate-100 rounded">
              <div className="font-medium">{i.title}</div>
              <div className="text-xs">{i.detail}</div>
            </div>
          ))}
        </div>
      )}
      {payload.adjustments && (
        <div>
          <h4 className="font-semibold mb-1">Ajustes semanais</h4>
          <ul className="list-disc list-inside">
            {payload.adjustments.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
