import React from 'react';

export default function ProfessorView({ payload }) {
  if (!payload) return null;
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="text-lg font-semibold mb-1">{payload.title}</h3>
        <p>{payload.overview}</p>
      </div>
      {payload.step_by_step && (
        <div>
          <h4 className="font-semibold mb-1">Passo a passo</h4>
          <ol className="list-decimal list-inside space-y-1">
            {payload.step_by_step.map((s, i) => (
              <li key={i}>{s.step}: {s.detail}</li>
            ))}
          </ol>
        </div>
      )}
      {payload.examples && (
        <div>
          <h4 className="font-semibold mb-1">Exemplos</h4>
          <ul className="space-y-2">
            {payload.examples.map((ex, i) => (
              <li key={i} className="p-2 bg-slate-100 rounded">
                <div className="font-medium">{ex.input}</div>
                <div>{ex.solution}</div>
                <div className="text-xs text-slate-600">{ex.why}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {payload.misconceptions && (
        <div>
          <h4 className="font-semibold mb-1">Erros comuns</h4>
          <ul className="list-disc list-inside">
            {payload.misconceptions.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {payload.practice && (
        <div>
          <h4 className="font-semibold mb-1">Mini-prática</h4>
          <ul className="space-y-1">
            {payload.practice.map((p, i) => (
              <li key={i}>{p.task}</li>
            ))}
          </ul>
        </div>
      )}
      {payload.reading_list && (
        <div>
          <h4 className="font-semibold mb-1">Leituras</h4>
          <ul className="list-disc list-inside">
            {payload.reading_list.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
