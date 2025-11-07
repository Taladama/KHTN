
import React, { useState, useEffect, useMemo } from 'react';
import { AnswerKey, Question } from '../types';
import { QUIZ_WARNING_THRESHOLD_SECONDS } from '../constants';
import ProgressBar from './ProgressBar';

interface QuizViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: AnswerKey) => void;
  timeRemaining: number;
  totalDurationSeconds: number;
}

const QuizView: React.FC<QuizViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  timeRemaining,
  totalDurationSeconds
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);
  const [error, setError] = useState('');

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const elapsedPercentage = useMemo(() => {
    if (totalDurationSeconds === 0) {
      return 0;
    }
    return ((totalDurationSeconds - timeRemaining) / totalDurationSeconds) * 100;
  }, [timeRemaining, totalDurationSeconds]);

  const isCriticalTime = timeRemaining <= QUIZ_WARNING_THRESHOLD_SECONDS;

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setError('');
  }, [question]);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      setError('Vui lòng chọn một đáp án!');
      return;
    }
    onSubmit(selectedAnswer);
  };

  const options: AnswerKey[] = ['a', 'b', 'c', 'd'];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">Quiz KHTN 8 Nâng Cao</h1>
        <p className="text-center text-slate-500 dark:text-slate-400">Hãy chọn đáp án đúng nhất cho mỗi câu hỏi.</p>
        <ProgressBar current={questionNumber} total={totalQuestions} />
        <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl bg-slate-100/70 p-4 text-sm font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-200 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wide text-xs text-slate-500 dark:text-slate-400">Thời gian còn lại</span>
            <span
              className={`text-lg font-semibold ${
                isCriticalTime ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {formattedTime}
            </span>
          </div>
          <div className="w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-2 rounded-full bg-sky-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, elapsedPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-6 min-h-[50px]">
          {`Câu ${questionNumber}: ${question.question}`}
        </h2>
        
        <div className="space-y-4">
          {options.map((key) => (
            <div key={key}>
              <input 
                type="radio" 
                id={`option-${key}`} 
                name="answer" 
                value={key} 
                checked={selectedAnswer === key}
                onChange={() => {
                  setSelectedAnswer(key);
                  setError('');
                }}
                className="hidden peer"
              />
              <label 
                htmlFor={`option-${key}`}
                className="block w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer text-slate-700 dark:text-slate-300 text-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 peer-checked:bg-sky-100 dark:peer-checked:bg-sky-900 peer-checked:border-sky-500 dark:peer-checked:border-sky-400 peer-checked:text-sky-800 dark:peer-checked:text-sky-200 peer-checked:font-semibold"
              >
                {`${key.toUpperCase()}. ${question[key]}`}
              </label>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <button 
          onClick={handleSubmit}
          className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-sky-700 transition duration-300 mt-8 text-lg focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800"
        >
          {questionNumber === totalQuestions ? 'Hoàn thành và Nộp bài' : 'Câu tiếp theo'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
