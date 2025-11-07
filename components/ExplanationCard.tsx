import React from 'react';
import { UserAnswer } from '../types';

interface ExplanationCardProps {
  userAnswerData: UserAnswer;
  onAskAI: (data: UserAnswer) => void;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ userAnswerData, onAskAI }) => {
  const { question, answerText, correctAnswerText, isCorrect, explanation, questionData, answerKey } = userAnswerData;
  const correctAnswerKey = questionData.correct;
  const isUnanswered = answerKey === 'unanswered';

  const statusStyles = isCorrect
    ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-900/30'
    : isUnanswered
    ? 'border-amber-200 bg-amber-50/80 dark:border-amber-500/40 dark:bg-amber-900/30'
    : 'border-rose-200 bg-rose-50/80 dark:border-rose-500/40 dark:bg-rose-900/30';

  const helperMessage = isCorrect
    ? 'Bạn đã trả lời chính xác câu hỏi này.'
    : isUnanswered
    ? 'Bạn bỏ trống câu hỏi, hệ thống đã tính là sai.'
    : `Bạn đã chọn: ${answerKey.toUpperCase()}. ${answerText}`;

  return (
    <div className={`space-y-3 rounded-2xl border px-5 py-4 shadow-sm transition ${statusStyles}`}>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{question}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">{helperMessage}</p>
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        Đáp án đúng: {correctAnswerKey.toUpperCase()}. {correctAnswerText}
      </p>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Giải thích:</span> {explanation}
      </p>
      <button
        onClick={() => onAskAI(userAnswerData)}
        className="inline-flex items-center gap-2 rounded-xl bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300 dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30 dark:focus-visible:outline-purple-500"
      >
        <span aria-hidden>✨</span>
        {isCorrect ? 'Mở rộng kiến thức với AI' : 'Nhờ AI phân tích lỗi sai'}
      </button>
    </div>
  );
};

export default ExplanationCard;
