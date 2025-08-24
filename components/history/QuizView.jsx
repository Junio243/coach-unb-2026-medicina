import React from 'react';

export default function QuizView({ payload, onPlay }) {
  const count = payload?.questions?.length || 0;
  return (
    <div className="space-y-3">
      <div>{count} questões</div>
      <button onClick={onPlay} className="bg-indigo-600 text-white px-4 py-2 rounded">
        Jogar agora
      </button>
    </div>
  );
}
