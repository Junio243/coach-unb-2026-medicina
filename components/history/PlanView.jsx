import React from 'react';
import Badge from '../Badge.jsx';

export default function PlanView({ payload }) {
  if (!payload) return null;
  const overview = payload.exam_overview || {};
  const subjects = overview.subjects || [];
  const weekly = payload.week_plan || [];
  return (
    <div className="space-y-4 text-sm">
      {overview.exam_name && (
        <div>
          <h3 className="font-semibold mb-1">{overview.exam_name}</h3>
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subjects.map((s, i) => (
                <Badge key={i}>{s}</Badge>
              ))}
            </div>
          )}
        </div>
      )}
      {payload.onboarding && (
        <div>
          <h4 className="font-semibold mb-1">Onboarding</h4>
          <p>{payload.onboarding}</p>
        </div>
      )}
      {weekly.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Plano semanal</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {weekly.map((day, i) => (
              <div key={i} className="bg-slate-100 p-2 rounded">
                <div className="font-medium mb-1">{day.day}</div>
                <ul className="space-y-1">
                  {day.tasks?.map((t, j) => (
                    <li key={j}>{t.subject} - {t.type}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
