import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById, answerQuestion, finishQuiz } from "../services/quizService.js";

export default function QuizPlayPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getQuizById(id);
        setQuiz(data);
      } catch (e) {
        setError(e.message || "Falha ao carregar quiz.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error)
    return <div className="p-6 text-red-600">{error}</div>;
  if (!quiz) return <div className="p-6">Quiz não encontrado.</div>;

  const q = quiz.questions[current];

  async function onSelect(i) {
    if (answers[current] !== undefined || answering) return;
    setAnswering(true);
    try {
      const res = await answerQuestion({
        quizId: quiz.id,
        questionIndex: current,
        selectedIndex: i,
        correctIndex: q.correctIndex,
      });
      setAnswers((prev) => ({ ...prev, [current]: i }));
      if (res.is_correct) setScore((s) => s + 1);
    } catch (e) {
      alert(e.message);
    } finally {
      setAnswering(false);
    }
  }

  async function onNext() {
    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1);
    } else {
      try {
        await finishQuiz({ quizId: quiz.id, score });
      } catch (e) {
        console.warn(e);
      }
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Resultado</h1>
        <p className="mb-4">
          Você acertou {score} de {quiz.questions.length} questões.
        </p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        Pergunta {current + 1} de {quiz.questions.length}
      </div>
      <div className="border rounded p-4 mb-4 bg-white">
        <div className="font-semibold mb-2">{q.statement}</div>
        <ul className="space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[current] === i;
            const isCorrect = i === q.correctIndex;
            return (
              <li key={i}>
                <button
                  className={`w-full text-left border rounded px-3 py-2 ${
                    selected
                      ? isCorrect
                        ? "bg-green-200 border-green-600"
                        : "bg-red-200 border-red-600"
                      : "bg-white"
                  }`}
                  disabled={answers[current] !== undefined}
                  onClick={() => onSelect(i)}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-between items-center">
        <div>
          {answers[current] !== undefined && (
            <span>
              {answers[current] === q.correctIndex
                ? "Correto!"
                : `Errado. Correta: ${q.options[q.correctIndex]}`}
            </span>
          )}
        </div>
        {answers[current] !== undefined && (
          <button
            onClick={onNext}
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            {current + 1 < quiz.questions.length ? "Próxima" : "Finalizar"}
          </button>
        )}
      </div>
    </main>
  );
}
