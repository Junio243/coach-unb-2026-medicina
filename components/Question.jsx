import React, { useState } from 'react';
import Badge from './Badge.jsx';

export default function Question({ question }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionSelect = (optionId) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
  };

  const getOptionClass = (optionId) => {
    if (!isAnswered) {
      return 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600';
    }
    if (optionId === question.answer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500';
    }
    if (optionId === selectedOption) {
      return 'bg-red-100 dark:bg-red-900 border-red-500';
    }
    return 'bg-white dark:bg-slate-700';
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <p className="font-semibold text-slate-800 dark:text-slate-100 flex-1">{question.statement}</p>
        <div className="flex items-center gap-2 ml-4">
          <Badge text={question.year} />
          <Badge text={question.difficulty} color={question.difficulty === 'fácil' ? 'green' : 'yellow'} />
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={isAnswered}
            className={`w-full text-left p-3 border rounded-md transition-colors ${getOptionClass(option.id)} disabled:cursor-not-allowed`}
          >
            <span className="font-bold mr-2">{option.id.toUpperCase()}.</span>
            {option.text}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-md">
          <h4 className="font-bold text-slate-800 dark:text-slate-100">Gabarito e Comentário</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            A resposta correta é a **{question.answer.toUpperCase()}**.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {question.comment}
          </p>
        </div>
      )}
    </div>
  );
}
