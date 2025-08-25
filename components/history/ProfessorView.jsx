import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ProfessorView({ payload }) {
  if (!payload) return null;
  return (
    <div className="space-y-4 text-sm">
      <h3 className="text-lg font-semibold">{payload.title}</h3>
      {payload.intro && <ReactMarkdown>{payload.intro}</ReactMarkdown>}
      {Array.isArray(payload.sections) &&
        payload.sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="font-semibold">{sec.heading}</h4>
            <ReactMarkdown>{sec.content}</ReactMarkdown>
            {sec.examples && sec.examples.length > 0 && (
              <ul className="list-disc list-inside">
                {sec.examples.map((ex, i) => (
                  <li key={i}>
                    <ReactMarkdown className="inline">{ex}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}
            {sec.exercise && (
              <div className="border-l-4 border-blue-500 bg-blue-50 p-2 rounded">
                <ReactMarkdown>{sec.exercise}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      {payload.conclusion && (
        <div>
          <h4 className="font-semibold">Conclusão</h4>
          <ReactMarkdown>{payload.conclusion}</ReactMarkdown>
        </div>
      )}
      {payload.recommendations && payload.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">Recomendações</h4>
          <ul className="space-y-1">
            {payload.recommendations.map((rec, i) => (
              <li key={i}>
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {rec.title}
                </a>
                <span className="text-xs text-slate-600 ml-1">({rec.type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
