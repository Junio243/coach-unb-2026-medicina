import React, { useState, useMemo } from 'react';
import allSubjects from '../data/subjects.json';
import allQuestions from '../data/questions.json';
import Question from '../components/Question.jsx';

export default function BancoDeQuestoesPage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const availableTopics = useMemo(() => {
    if (!selectedSubject) return [];
    const subject = allSubjects.find(s => s.id === selectedSubject);
    return subject ? subject.topics : [];
  }, [selectedSubject]);

  const filteredQuestions = useMemo(() => {
    if (!selectedTopic) return [];
    return allQuestions.filter(q => q.topicId === selectedTopic);
  }, [selectedTopic]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedTopic(''); // Reset topic when subject changes
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Banco de Questões</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
        {/* Subject Filter */}
        <div className="flex-1">
          <label htmlFor="subject-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Matéria
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
          >
            <option value="">Selecione uma matéria</option>
            {allSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Filter */}
        <div className="flex-1">
          <label htmlFor="topic-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Tópico
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={!selectedSubject || availableTopics.length === 0}
            className="w-full p-2 border rounded-md bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800"
          >
            <option value="">Selecione um tópico</option>
            {availableTopics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {selectedTopic && filteredQuestions.length > 0 ? (
          filteredQuestions.map(question => (
            <Question key={question.id} question={question} />
          ))
        ) : (
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow">
            <p className="text-slate-500 dark:text-slate-400">Selecione uma matéria e um tópico para ver as questões.</p>
          </div>
        )}
      </div>
    </div>
  );
}
