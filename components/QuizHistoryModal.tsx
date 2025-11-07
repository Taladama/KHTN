import React, { useState, useEffect, useMemo } from 'react';
import { QuizAttempt } from '../types';
import { MAX_HISTORY_ATTEMPTS } from '../constants';

interface QuizHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: QuizAttempt[];
  activeStudentName?: string;
}

const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({ isOpen, onClose, history, activeStudentName }) => {
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setExpandedAttemptId(null);
      setSelectedName('');
      return;
    }

    if (activeStudentName && history.some(attempt => attempt.studentName === activeStudentName)) {
      setSelectedName(activeStudentName);
    }
  }, [isOpen, activeStudentName, history]);

  const uniqueNames = useMemo(() => {
    const names = Array.from(new Set(history.map(attempt => attempt.studentName.trim())));
    return names.sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
  }, [history]);

  const filteredHistory = selectedName
    ? history.filter(attempt => attempt.studentName === selectedName)
    : history;

  if (!isOpen) {
    return null;
  }

  const handleToggle = (attemptId: string) => {
    setExpandedAttemptId(prev => (prev === attemptId ? null : attemptId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lịch sử bài làm</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 shadow hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-500"
          >
            Đóng
          </button>
        </div>

        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          Lưu tối đa {MAX_HISTORY_ATTEMPTS} bài làm gần nhất.
        </p>

        {history.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-300">
            Chưa có bài làm nào được lưu. Hãy hoàn thành một bài kiểm tra để bắt đầu lưu lịch sử.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-800/40">
              <label htmlFor="name-filter" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Lọc theo tên học sinh
              </label>
              <select
                id="name-filter"
                value={selectedName}
                onChange={event => setSelectedName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-700"
              >
                <option value="">Tất cả học sinh</option>
                {uniqueNames.map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {filteredHistory.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
                Không tìm thấy bài làm nào khớp với tên đã chọn.
              </p>
            )}

            {filteredHistory.map(attempt => {
              const isExpanded = expandedAttemptId === attempt.id;
              const formattedDate = new Date(attempt.timestamp).toLocaleString('vi-VN');

              return (
                <div
                  key={attempt.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(attempt.id)}
                    className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {attempt.studentName}
                      </p>
                      <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {formattedDate}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Điểm số: {attempt.score}/{attempt.totalQuestions}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                      {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
                      {attempt.answers.map((answer, index) => (
                        <div
                          key={`${attempt.id}-${index}`}
                          className="rounded-xl bg-white p-4 shadow dark:bg-slate-800"
                        >
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {answer.question}
                          </p>
                          <p
                            className={`mt-2 text-sm font-medium ${answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                          >
                            Câu trả lời của bạn: {answer.answerKey === 'unanswered' ? 'Chưa trả lời' : answer.answerText}
                          </p>
                          {!answer.isCorrect && (
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              Đáp án đúng: {answer.correctAnswerText}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistoryModal;
