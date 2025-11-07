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

  const { answers } = candidate;
  if (!Array.isArray(answers)) {
    return false;
  }

  return answers.every(isUserAnswerRecord);
};

const App: React.FC = () => {
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const startQuiz = useCallback(() => {
    setQuizStatus('loading');
    const shuffled = shuffleArray(allQuestions);
    setQuestions(shuffled.slice(0, NUM_QUESTIONS_PER_QUIZ));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizStatus('active');
  }, []);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

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
        answers: updatedAnswers
      };

      saveAttemptToHistory(attempt);
      setQuizStatus('finished');
    }
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
            onRetry={startQuiz}
            onAskAI={handleAskAI}
            onShowHistory={() => setIsHistoryOpen(true)}
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
      />
    </div>
  );
};

export default App;