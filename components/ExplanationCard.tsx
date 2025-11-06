import React from 'react';
import { UserAnswer } from '../types';

interface ExplanationCardProps {
    userAnswerData: UserAnswer;
    onAskAI: (data: UserAnswer) => void;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ userAnswerData, onAskAI }) => {
    const { question, answerText, correctAnswerText, isCorrect, explanation, questionData, answerKey } = userAnswerData;
    const correctAnswerKey = questionData.correct;

    const cardBg = isCorrect 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30';
    
    return (
        <div className={`p-4 mb-3 rounded-lg border ${cardBg}`}>
            <p className="font-bold text-slate-800 dark:text-slate-100">{question}</p>
            
            {!isCorrect && (
                 <p className="text-red-700 dark:text-red-400 font-medium mt-2">
                    Bạn đã chọn: {answerKey.toUpperCase()}. {answerText}
                 </p>
            )}
            <p className="text-green-700 dark:text-green-400 font-medium mt-1">
                Đáp án đúng: {correctAnswerKey.toUpperCase()}. {correctAnswerText}
            </p>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                <strong>Giải thích:</strong> {explanation}
            </p>

            <button 
                onClick={() => onAskAI(userAnswerData)}
                className="mt-3 py-2 px-4 bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300 font-semibold rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800/80 transition duration-300"
            >
                {isCorrect ? '✨ Mở rộng kiến thức' : '✨ Phân tích lỗi sai'}
            </button>
        </div>
    );
};

export default ExplanationCard;