
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
  studentName: string;
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
  totalDurationSeconds,
  studentName
}) => {

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const answeredCount = useMemo(
    () => questionStatuses.filter(status => status === 'answered').length,
    [questionStatuses]
  );

  const unansweredCount = totalQuestions - answeredCount;

  const timeRemainingPercentage = useMemo(() => {
    if (totalDurationSeconds === 0) {
      return 0;
    }
    return (timeRemaining / totalDurationSeconds) * 100;
  }, [timeRemaining, totalDurationSeconds]);

  const isCriticalTime = timeRemaining <= QUIZ_WARNING_THRESHOLD_SECONDS;

  const options: AnswerKey[] = ['a', 'b', 'c', 'd'];
  const optionGroupName = useMemo(() => `question-${questionNumber}`, [questionNumber]);
  const legendId = useMemo(() => `${optionGroupName}-legend`, [optionGroupName]);

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Quiz KHTN 8 Nâng Cao</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Hãy chọn đáp án đúng nhất cho mỗi câu hỏi.</p>
        {studentName && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-800/70 dark:text-slate-200">
            Học sinh: <span className="font-semibold text-slate-900 dark:text-slate-100">{studentName}</span>
          </p>
        )}
      </div>
      <header className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-sky-100/80 px-4 py-1 text-sm font-semibold text-sky-700 dark:bg-slate-800/70 dark:text-sky-300">
              {`Câu hỏi ${questionNumber}/${totalQuestions}`}
            </span>
            <div className="grid grid-cols-2 gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 sm:max-w-sm">
              <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Đã trả lời</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{answeredCount}</p>
              </div>
              <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm dark:bg-slate-800/80">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Còn lại</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{unansweredCount}</p>
              </div>
            </div>
          </div>
          <div className="w-full space-y-4 md:max-w-xs">
            <div
              className={`rounded-2xl border px-4 py-5 text-center shadow-sm ${
                isCriticalTime
                  ? 'border-rose-200/70 bg-rose-50/80 text-rose-600 dark:border-rose-500/40 dark:bg-rose-900/40 dark:text-rose-300'
                  : 'border-sky-100/80 bg-sky-50/80 text-sky-700 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-200'
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Thời gian còn lại</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight" aria-live="polite">
                {formattedTime}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Hết giờ hệ thống sẽ tự động nộp bài.</p>
            </div>
            <ProgressBar
              current={answeredCount}
              total={totalQuestions}
              label="Tiến độ hoàn thành"
              helperText={`${answeredCount} / ${totalQuestions} câu đã trả lời`}
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-700/70">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isCriticalTime ? 'bg-rose-400 dark:bg-rose-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, timeRemainingPercentage))}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tiến trình thời gian</span>
            <span>{`${Math.round(Math.max(0, timeRemainingPercentage))}% còn lại`}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2.05fr)_minmax(0,1fr)]">
        <section className="space-y-6">
          <article className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <fieldset className="space-y-6">
              <legend id={legendId} className="text-xl font-semibold leading-8 text-slate-900 dark:text-slate-50 md:text-2xl">
                {question.question}
              </legend>
              <div className="space-y-4" role="radiogroup" aria-labelledby={legendId}>
                {options.map(key => {
                  const optionId = `question-${questionNumber}-option-${key}`;
                  const isChecked = selectedAnswer === key;

                  return (
                    <div key={key}>
                      <input
                        type="radio"
                        id={optionId}
                        name={optionGroupName}
                        value={key}
                        checked={isChecked}
                        onChange={() => onSelectAnswer(key)}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={optionId}
                        className="flex w-full items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-base font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-sky-200 hover:bg-sky-50/70 peer-checked:border-sky-400 peer-checked:bg-sky-50 peer-checked:text-sky-800 peer-checked:shadow-inner dark:border-slate-600/80 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:peer-checked:border-sky-400 dark:peer-checked:bg-sky-900/40 dark:peer-checked:text-sky-200"
                      >
                        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700 dark:bg-sky-900/60 dark:text-sky-200">
                          {key.toUpperCase()}
                        </span>
                        <span className="leading-relaxed">{question[key]}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </article>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`rounded-2xl border px-4 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 dark:focus-visible:outline-slate-600 ${
                canGoPrevious
                  ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500'
              }`}
            >
              Câu trước
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canGoNext}
              className={`rounded-2xl border px-4 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 dark:focus-visible:outline-sky-600 ${
                canGoNext
                  ? 'border-sky-400 bg-sky-500 text-white shadow-sm hover:bg-sky-600'
                  : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-500'
              }`}
            >
              Câu tiếp theo
            </button>
            <button
              type="button"
              onClick={onSubmitQuiz}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 dark:focus-visible:outline-emerald-600 sm:col-span-3"
            >
              Nộp bài
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Danh sách câu hỏi</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Chọn nhanh câu hỏi bạn muốn xem lại.</p>
          <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {questionStatuses.map((status, index) => {
              const isActive = index === activeQuestionIndex;
              const statusLabel = isActive ? 'Đang xem' : status === 'answered' ? 'Đã trả lời' : 'Chưa trả lời';
              const baseClasses =
                'flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400';
              const statusClasses = isActive
                ? 'border-sky-400 bg-sky-100 text-sky-700 dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-200'
                : status === 'answered'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onJumpToQuestion(index)}
                  className={`${baseClasses} ${statusClasses}`}
                  aria-label={`${statusLabel} - Câu ${index + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" /> Đã trả lời
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-500" /> Chưa trả lời
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-sky-500" /> Đang xem
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizView;
