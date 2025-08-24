import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      window.addEventListener('keydown', onEsc);
    }
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  function stop(e) {
    e.stopPropagation();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={stop}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto w-full max-w-2xl"
      >
        <div className="flex justify-between items-start mb-4">
          {title && <h2 className="text-lg font-semibold mr-8">{title}</h2>}
          <button
            aria-label="Fechar"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}
