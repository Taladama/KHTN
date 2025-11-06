import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizStatus, UserAnswer } from './types';
import { allQuestions, NUM_QUESTIONS_PER_QUIZ } from './constants';
import { fetchExplanation, generatePrompt } from './services/geminiService';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import GeminiModal from './components/GeminiModal';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);

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
  
  const handleAnswerSubmit = (answerKey: 'a' | 'b' | 'c' | 'd') => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerKey === currentQuestion.correct;

    setUserAnswers(prev => [...prev, {
        question: `Câu ${currentQuestionIndex + 1}: ${currentQuestion.question}`,
        answerKey: answerKey,
        answerText: currentQuestion[answerKey],
        correctAnswerText: currentQuestion[currentQuestion.correct],
        isCorrect,
        explanation: currentQuestion.explanation,
        questionData: currentQuestion
    }]);

    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
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
    <div className="min-h-screen flex items-center justify-center p-4">
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
          />
        )}
      </main>
      <GeminiModal
        isOpen={isModalOpen}
        isLoading={isModalLoading}
        content={modalContent}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;