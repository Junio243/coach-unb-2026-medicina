import React from 'react';

export default function Spinner({ label = 'Carregando', fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center" role="status" aria-label={label}>
      <svg
        className="w-6 h-6 animate-spin text-indigo-600 mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      {label && <div className="text-sm text-slate-700 dark:text-slate-200">{label}</div>}
      <span className="sr-only">Carregando…</span>
    </div>
  );
  if (fullPage) {
    return (
      <div className="flex items-center justify-center w-full h-full py-10 min-h-[200px]" role="status">
        {content}
      </div>
    );
  }
  return content;
}
