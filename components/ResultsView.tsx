
import React, { useState, useMemo } from 'react';
import { UserAnswer } from '../types';
import ExplanationCard from './ExplanationCard';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  onRetry: () => void;
  onAskAI: (data: UserAnswer) => void;
  onShowHistory: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score, totalQuestions, userAnswers, onRetry, onAskAI, onShowHistory }) => {
  const [showExplanations, setShowExplanations] = useState(false);

  const { title, titleColor } = useMemo(() => {
    const percentage = score / totalQuestions;
    if (percentage >= 0.8) {
      return { title: 'Xuất sắc!', titleColor: 'text-green-600 dark:text-green-400' };
    }
    if (percentage >= 0.5) {
      return { title: 'Khá tốt!', titleColor: 'text-sky-600 dark:text-sky-400' };
    }
    return { title: 'Cần cố gắng thêm!', titleColor: 'text-yellow-600 dark:text-yellow-400' };
  }, [score, totalQuestions]);

  return (
    <div className="text-center w-full">
      <h2 className={`text-3xl font-bold mb-4 ${titleColor}`}>{title}</h2>
      <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
        Bạn đã trả lời đúng {score} trên tổng số {totalQuestions} câu hỏi.
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Kết quả đã được lưu vào lịch sử. Bạn có thể xem lại bất cứ lúc nào.
      </p>

      <div className="flex flex-col space-y-4">
        <button
          onClick={onRetry}
          className="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-800 transition duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-800"
        >
          Làm lại
        </button>

        <button
          onClick={() => setShowExplanations(!showExplanations)}
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
        >
          {showExplanations ? 'Ẩn giải thích' : 'Xem giải thích đáp án'}
        </button>

        <button
          onClick={onShowHistory}
          className="w-full bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-200 transition duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-600"
        >
          Xem lịch sử bài làm
        </button>
      </div>

      {showExplanations && (
        <div className="mt-6 text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          {userAnswers.map((answer, index) => (
            <ExplanationCard 
                key={index}
                userAnswerData={answer}
                onAskAI={onAskAI}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsView;
