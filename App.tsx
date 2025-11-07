import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizStatus, UserAnswer, QuizAttempt } from './types';
import { allQuestions, NUM_QUESTIONS_PER_QUIZ, QUIZ_HISTORY_STORAGE_KEY, MAX_HISTORY_ATTEMPTS } from './constants';
import { fetchExplanation, generatePrompt } from './services/geminiService';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import GeminiModal from './components/GeminiModal';
import QuizHistoryModal from './components/QuizHistoryModal';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const isAnswerKey = (value: unknown): value is UserAnswer['answerKey'] =>
  value === 'a' || value === 'b' || value === 'c' || value === 'd';

const isQuestionRecord = (value: unknown): value is Question => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Question>;

  return (
    typeof candidate.question === 'string' &&
    typeof candidate.a === 'string' &&
    typeof candidate.b === 'string' &&
    typeof candidate.c === 'string' &&
    typeof candidate.d === 'string' &&
    isAnswerKey(candidate.correct) &&
    typeof candidate.explanation === 'string'
  );
};

const isUserAnswerRecord = (value: unknown): value is UserAnswer => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<UserAnswer>;

  return (
    typeof candidate.question === 'string' &&
    isAnswerKey(candidate.answerKey) &&
    typeof candidate.answerText === 'string' &&
    typeof candidate.correctAnswerText === 'string' &&
    typeof candidate.isCorrect === 'boolean' &&
    typeof candidate.explanation === 'string' &&
    isQuestionRecord(candidate.questionData)
  );
};

const isQuizAttemptRecord = (value: unknown): value is QuizAttempt => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<QuizAttempt>;

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.timestamp !== 'string' ||
    typeof candidate.score !== 'number' ||
    typeof candidate.totalQuestions !== 'number'
  ) {
    return false;
  }

  if (typeof candidate.studentName !== 'string' || candidate.studentName.trim().length === 0) {
    return false;
  }

  const { answers } = candidate;
  if (!Array.isArray(answers)) {
    return false;
  }

  return answers.every(isUserAnswerRecord);
};

const App: React.FC = () => {
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [studentName, setStudentName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [isNamePromptVisible, setIsNamePromptVisible] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const startQuiz = useCallback((name: string) => {
    const trimmedName = name.trim();
    setStudentName(trimmedName);
    setQuizStatus('loading');
    const shuffled = shuffleArray(allQuestions);
    setQuestions(shuffled.slice(0, NUM_QUESTIONS_PER_QUIZ));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizStatus('active');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedHistory = window.localStorage.getItem(QUIZ_HISTORY_STORAGE_KEY);
    if (storedHistory) {
      try {
        const parsedHistory: unknown = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          const sanitizedHistory = parsedHistory.filter(isQuizAttemptRecord);
          if (sanitizedHistory.length > 0) {
            const cappedHistory = sanitizedHistory.slice(0, MAX_HISTORY_ATTEMPTS);
            setQuizHistory(cappedHistory);

            if (cappedHistory.length !== sanitizedHistory.length || cappedHistory.length !== parsedHistory.length) {
              try {
                window.localStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, JSON.stringify(cappedHistory));
              } catch (error) {
                console.error('Không thể chuẩn hóa dữ liệu lịch sử trong bộ nhớ:', error);
              }
            }
          } else {
            console.warn('Không tìm thấy bản ghi lịch sử hợp lệ trong bộ nhớ.');
          }
        }
      } catch (error) {
        console.error('Không thể đọc lịch sử bài làm đã lưu:', error);
      }
    }
  }, []);

  const saveAttemptToHistory = useCallback((attempt: QuizAttempt) => {
    setQuizHistory(prevHistory => {
      const updatedHistory = [attempt, ...prevHistory].slice(0, MAX_HISTORY_ATTEMPTS);

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error('Không thể lưu lịch sử bài làm:', error);
        }
      }

      return updatedHistory;
    });
  }, []);

  const handleAnswerSubmit = (answerKey: 'a' | 'b' | 'c' | 'd') => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerKey === currentQuestion.correct;
    const answerData: UserAnswer = {
      question: `Câu ${currentQuestionIndex + 1}: ${currentQuestion.question}`,
      answerKey,
      answerText: currentQuestion[answerKey],
      correctAnswerText: currentQuestion[currentQuestion.correct],
      isCorrect,
      explanation: currentQuestion.explanation,
      questionData: currentQuestion
    };

    const updatedAnswers = [...userAnswers, answerData];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const attempt: QuizAttempt = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        score: updatedAnswers.filter(answer => answer.isCorrect).length,
        totalQuestions: questions.length,
        answers: updatedAnswers,
        studentName
      };

      saveAttemptToHistory(attempt);
      setQuizStatus('finished');
    }
  };

  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = nameInput.trim();

    if (!trimmed) {
      setNameError('Vui lòng nhập tên học sinh trước khi bắt đầu làm bài.');
      return;
    }

    setNameError('');
    setIsNamePromptVisible(false);
    setNameInput(trimmed);
    startQuiz(trimmed);
  };

  const handleOpenNamePrompt = () => {
    setNameInput(studentName);
    setNameError('');
    setIsNamePromptVisible(true);
  };

  const handleCloseNamePrompt = () => {
    if (!studentName) {
      return;
    }

    setIsNamePromptVisible(false);
    setNameError('');
    setNameInput(studentName);
  };

  const handleAskAI = async (data: UserAnswer) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalContent('');
    
    const prompt = generatePrompt(data);
    const response = await fetchExplanation(prompt);
    
    setModalContent(response);
    setIsModalLoading(false);
  };

  const score = userAnswers.filter(a => a.isCorrect).length;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed top-4 right-4 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur hover:bg-white dark:bg-slate-800/80 dark:text-slate-100"
      >
        Lịch sử bài làm
      </button>
      <main className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl p-6 md:p-10">
        {quizStatus === 'active' && questions.length > 0 && (
          <QuizView
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onSubmit={handleAnswerSubmit}
          />
        )}
        {quizStatus === 'finished' && (
          <ResultsView
            score={score}
            totalQuestions={questions.length}
            userAnswers={userAnswers}
            onRetry={handleOpenNamePrompt}
            onAskAI={handleAskAI}
            onShowHistory={() => setIsHistoryOpen(true)}
            studentName={studentName}
          />
        )}
      </main>
      <GeminiModal
        isOpen={isModalOpen}
        isLoading={isModalLoading}
        content={modalContent}
        onClose={() => setIsModalOpen(false)}
      />
      <QuizHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={quizHistory}
        activeStudentName={studentName}
      />
      {isNamePromptVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nhập tên học sinh</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Mỗi bài làm sẽ được lưu kèm tên học sinh để tiện tra cứu lịch sử sau này.
            </p>
            <form onSubmit={handleNameSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="student-name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Tên học sinh
                </label>
                <input
                  id="student-name"
                  name="student-name"
                  type="text"
                  value={nameInput}
                  onChange={event => setNameInput(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-700"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  autoComplete="off"
                  autoFocus
                />
                {nameError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameError}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                {studentName && (
                  <button
                    type="button"
                    onClick={handleCloseNamePrompt}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Hủy
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-700"
                >
                  Bắt đầu làm bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;