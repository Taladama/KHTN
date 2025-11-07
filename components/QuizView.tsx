
import React, { useMemo } from 'react';
import { AnswerKey, Question } from '../types';
import { QUIZ_WARNING_THRESHOLD_SECONDS } from '../constants';
import ProgressBar from './ProgressBar';

type QuestionStatus = 'answered' | 'unanswered';

interface QuizViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: AnswerKey | null;
  onSelectAnswer: (answer: AnswerKey) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onSubmitQuiz: () => void;
  questionStatuses: QuestionStatus[];
  onJumpToQuestion: (index: number) => void;
  activeQuestionIndex: number;
  timeRemaining: number;
  totalDurationSeconds: number;
}

const QuizView: React.FC<QuizViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  canGoPrevious,
  canGoNext,
  onSubmitQuiz,
  questionStatuses,
  onJumpToQuestion,
  activeQuestionIndex,
  timeRemaining,
  totalDurationSeconds
}) => {

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

        <div className="mb-6 rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Danh sách câu hỏi</p>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
            {questionStatuses.map((status, index) => {
              const isActive = index === activeQuestionIndex;
              const baseClasses =
                'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
              const statusClasses = isActive
                ? 'border-sky-500 bg-sky-100 text-sky-700 focus:ring-sky-200 dark:border-sky-400 dark:bg-sky-900 dark:text-sky-200 dark:focus:ring-sky-700'
                : status === 'answered'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-800/60 dark:focus:ring-emerald-700'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus:ring-slate-500';

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onJumpToQuestion(index)}
                  className={`${baseClasses} ${statusClasses}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> Đã trả lời
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-500" /> Chưa trả lời
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-sky-500" /> Đang xem
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {options.map(key => (
            <div key={key}>
              <input
                type="radio"
                id={`option-${key}`}
                name="answer"
                value={key}
                checked={selectedAnswer === key}
                onChange={() => onSelectAnswer(key)}
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
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`w-full rounded-lg border px-4 py-3 text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 ${
              canGoPrevious
                ? 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800'
                : 'cursor-not-allowed border-slate-200 text-slate-300 dark:border-slate-700 dark:text-slate-500'
            }`}
          >
            Câu trước
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className={`w-full rounded-lg border px-4 py-3 text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-700 ${
              canGoNext
                ? 'border-sky-500 bg-sky-600 text-white shadow hover:bg-sky-700'
                : 'cursor-not-allowed border-slate-200 bg-slate-200 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
            }`}
          >
            Câu tiếp theo
          </button>
          <button
            type="button"
            onClick={onSubmitQuiz}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-800"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
