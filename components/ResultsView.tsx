
import React, { useState, useMemo } from 'react';
import { UserAnswer } from '../types';
import ExplanationCard from './ExplanationCard';
import ProgressBar from './ProgressBar';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  onRetry: () => void;
  onAskAI: (data: UserAnswer) => void;
  onShowHistory: () => void;
  studentName: string;
  unansweredCount: number;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  score,
  totalQuestions,
  userAnswers,
  onRetry,
  onAskAI,
  onShowHistory,
  studentName,
  unansweredCount
}) => {
  const [showExplanations, setShowExplanations] = useState(false);

  const { title, titleColor } = useMemo(() => {
    const percentage = totalQuestions > 0 ? score / totalQuestions : 0;
    if (percentage >= 0.8) {
      return { title: 'Xuất sắc!', titleColor: 'text-emerald-600 dark:text-emerald-400' };
    }
    if (percentage >= 0.5) {
      return { title: 'Khá tốt!', titleColor: 'text-sky-600 dark:text-sky-400' };
    }
    return { title: 'Cần cố gắng thêm!', titleColor: 'text-amber-600 dark:text-amber-400' };
  }, [score, totalQuestions]);

  const accuracy = useMemo(() => (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0), [score, totalQuestions]);
  const answeredCount = totalQuestions - unansweredCount;
  const incorrectCount = totalQuestions - score;

  return (
    <div className="w-full space-y-10 text-left">
      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kết quả bài làm</p>
        <h2 className={`mt-2 text-3xl font-bold tracking-tight ${titleColor}`}>{title}</h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
          Học sinh <span className="font-semibold text-slate-800 dark:text-slate-100">{studentName}</span> đã trả lời đúng{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-100">{score}</span> trên tổng số{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-100">{totalQuestions}</span> câu hỏi.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-700/50 dark:bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Độ chính xác tổng thể: <span className="font-semibold text-slate-800 dark:text-slate-100">{accuracy}%</span>
            </span>
            <span>{answeredCount} câu đã trả lời · {incorrectCount} câu sai</span>
          </div>
          <div className="mt-3">
            <ProgressBar current={score} total={totalQuestions} label="Điểm số tổng thể" helperText={`${score} câu đúng`} />
          </div>
        </div>
        {unansweredCount > 0 && (
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
            Có {unansweredCount} câu hỏi để trống và được tính là sai khi chấm điểm.
          </p>
        )}
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Kết quả đã tự động lưu vào lịch sử. Bạn có thể mở lại để xem chi tiết bất cứ lúc nào.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Điểm số</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{score}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Trên {totalQuestions} câu hỏi</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tỉ lệ chính xác</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{accuracy}%</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{answeredCount} câu đã trả lời</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Câu bỏ trống</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{unansweredCount}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tính cả các câu bỏ trống</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <button
            onClick={onRetry}
            className="rounded-2xl border border-sky-400 bg-sky-500 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 dark:focus-visible:outline-sky-600"
          >
            Làm lại
          </button>
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            aria-expanded={showExplanations}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-sky-200 dark:focus-visible:outline-slate-600"
          >
            {showExplanations ? 'Ẩn giải thích' : 'Xem giải thích đáp án'}
          </button>
          <button
            onClick={onShowHistory}
            className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-600"
          >
            Xem lịch sử bài làm
          </button>
        </div>
      </section>

      {showExplanations && (
        <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Giải thích từng câu hỏi</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Xem lại lời giải chi tiết và yêu cầu trợ giúp AI cho những câu hỏi bạn còn băn khoăn.
          </p>
          <div className="space-y-4">
            {userAnswers.map((answer, index) => (
              <ExplanationCard key={index} userAnswerData={answer} onAskAI={onAskAI} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsView;
