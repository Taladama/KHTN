import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnswerKey, Question, QuizStatus, UserAnswer, QuizAttempt, RecordedAnswerKey } from './types';
import {
  allQuestions,
  NUM_QUESTIONS_PER_QUIZ,
  QUIZ_HISTORY_STORAGE_KEY,
  MAX_HISTORY_ATTEMPTS,
  QUIZ_DURATION_SECONDS,
  QUIZ_WARNING_THRESHOLD_SECONDS,
  QUIZ_WARNING_DISPLAY_DURATION_MS
} from './constants';
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

const isAnswerKey = (value: unknown): value is AnswerKey =>
  value === 'a' || value === 'b' || value === 'c' || value === 'd';

const isRecordedAnswerKey = (value: unknown): value is UserAnswer['answerKey'] =>
  value === 'unanswered' || isAnswerKey(value);

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
    isRecordedAnswerKey(candidate.answerKey) &&
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
  const [selectedAnswers, setSelectedAnswers] = useState<(AnswerKey | null)[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [studentName, setStudentName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [isNamePromptVisible, setIsNamePromptVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [submissionPrompt, setSubmissionPrompt] = useState<{
    firstUnansweredIndex: number | null;
    unansweredCount: number;
  } | null>(null);

  const isAnyOverlayOpen =
    isNamePromptVisible ||
    isHistoryOpen ||
    submissionPrompt !== null ||
    isModalOpen;

  const startQuiz = useCallback((name: string) => {
    const trimmedName = name.trim();
    setStudentName(trimmedName);
    setQuizStatus('loading');
    setTimeRemaining(QUIZ_DURATION_SECONDS);
    setHasShownWarning(false);
    setIsWarningVisible(false);
    setSubmissionPrompt(null);
    const shuffled = shuffleArray(allQuestions);
    const quizQuestions = shuffled.slice(0, NUM_QUESTIONS_PER_QUIZ);
    setQuestions(quizQuestions);
    setSelectedAnswers(Array.from({ length: quizQuestions.length }, () => null));
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
          const sanitizedHistory = parsedHistory
            .filter(isQuizAttemptRecord)
            .map(attempt => ({
              ...attempt,
              studentName: attempt.studentName.trim()
            }));

          if (sanitizedHistory.length > 0) {
            const cappedHistory = sanitizedHistory.slice(0, MAX_HISTORY_ATTEMPTS);
            setQuizHistory(cappedHistory);

            if (!studentName && cappedHistory[0]) {
              setStudentName(cappedHistory[0].studentName);
              setNameInput(cappedHistory[0].studentName);
            }

            const normalizedHistoryString = JSON.stringify(cappedHistory);
            if (storedHistory !== normalizedHistoryString) {
              try {
                window.localStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, normalizedHistoryString);
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

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    if (isAnyOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAnyOverlayOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isAnyOverlayOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (isModalOpen) {
        setIsModalOpen(false);
        return;
      }

      if (submissionPrompt) {
        setSubmissionPrompt(null);
        return;
      }

      if (isHistoryOpen) {
        setIsHistoryOpen(false);
        return;
      }

      if (isNamePromptVisible && studentName) {
        setIsNamePromptVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyOverlayOpen, isHistoryOpen, isModalOpen, isNamePromptVisible, submissionPrompt, studentName]);

  const saveAttemptToHistory = useCallback((attempt: QuizAttempt) => {
    setQuizHistory(prevHistory => {
      const normalizedAttempt: QuizAttempt = {
        ...attempt,
        studentName: attempt.studentName.trim()
      };
      const normalizedHistory = prevHistory.map(historyAttempt => ({
        ...historyAttempt,
        studentName: historyAttempt.studentName.trim()
      }));
      const updatedHistory = [normalizedAttempt, ...normalizedHistory].slice(0, MAX_HISTORY_ATTEMPTS);

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

  useEffect(() => {
    if (quizStatus !== 'active' || typeof window === 'undefined') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [quizStatus]);

  useEffect(() => {
    if (quizStatus !== 'active') {
      return;
    }

    if (timeRemaining === QUIZ_WARNING_THRESHOLD_SECONDS && !hasShownWarning) {
      setHasShownWarning(true);
      setIsWarningVisible(true);
    }
  }, [quizStatus, timeRemaining, hasShownWarning]);

  useEffect(() => {
    if (!isWarningVisible || typeof window === 'undefined') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsWarningVisible(false);
    }, QUIZ_WARNING_DISPLAY_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isWarningVisible]);

  const createUserAnswerRecord = useCallback(
    (question: Question, questionNumber: number, selectedKey: RecordedAnswerKey): UserAnswer => {
      const correctAnswerKey = question.correct;
      const correctAnswerText = question[correctAnswerKey];

      if (selectedKey === 'unanswered') {
        return {
          question: `Câu ${questionNumber}: ${question.question}`,
          answerKey: 'unanswered',
          answerText: 'Chưa trả lời',
          correctAnswerText,
          isCorrect: false,
          explanation: question.explanation,
          questionData: question
        };
      }

      const answerText = question[selectedKey];
      const isCorrect = selectedKey === correctAnswerKey;

      return {
        question: `Câu ${questionNumber}: ${question.question}`,
        answerKey: selectedKey,
        answerText,
        correctAnswerText,
        isCorrect,
        explanation: question.explanation,
        questionData: question
      };
    },
    []
  );

  const buildUserAnswers = useCallback((): UserAnswer[] => {
    if (questions.length === 0) {
      return [];
    }

    return questions.map((question, index) => {
      const selected = selectedAnswers[index] ?? null;
      const recordedKey: RecordedAnswerKey = selected ?? 'unanswered';
      return createUserAnswerRecord(question, index + 1, recordedKey);
    });
  }, [questions, selectedAnswers, createUserAnswerRecord]);

  const finalizeQuiz = useCallback(() => {
    if (questions.length === 0) {
      return;
    }

    const completedAnswers = buildUserAnswers();

    const attempt: QuizAttempt = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      score: completedAnswers.filter(answer => answer.isCorrect).length,
      totalQuestions: questions.length,
      answers: completedAnswers,
      studentName
    };

    setSubmissionPrompt(null);
    setUserAnswers(completedAnswers);
    saveAttemptToHistory(attempt);
    setQuizStatus('finished');
    setIsWarningVisible(false);
  }, [buildUserAnswers, questions.length, saveAttemptToHistory, studentName]);

  useEffect(() => {
    if (quizStatus !== 'active' || timeRemaining > 0) {
      return;
    }

    if (questions.length === 0) {
      return;
    }

    finalizeQuiz();
  }, [quizStatus, timeRemaining, questions, finalizeQuiz]);

  const handleSelectAnswer = (answerKey: AnswerKey) => {
    setSelectedAnswers(prev => {
      if (prev.length === 0) {
        return prev;
      }

      const updated = [...prev];
      updated[currentQuestionIndex] = answerKey;
      return updated;
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = () => {
    if (questions.length === 0) {
      return;
    }

    const unansweredIndices = selectedAnswers.reduce<number[]>((accumulator, answer, index) => {
      if (!answer) {
        accumulator.push(index);
      }
      return accumulator;
    }, []);

    if (unansweredIndices.length > 0) {
      setSubmissionPrompt({
        firstUnansweredIndex: unansweredIndices[0],
        unansweredCount: unansweredIndices.length
      });
      return;
    }

    finalizeQuiz();
  };

  const handleConfirmSubmit = () => {
    finalizeQuiz();
  };

  const handleReturnToUnanswered = () => {
    if (submissionPrompt?.firstUnansweredIndex != null) {
      setCurrentQuestionIndex(submissionPrompt.firstUnansweredIndex);
    }
    setSubmissionPrompt(null);
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

    try {
      const prompt = generatePrompt(data);
      const response = await fetchExplanation(prompt);
      setModalContent(response);
    } catch (error) {
      console.error('Không thể tải giải thích từ AI:', error);
      setModalContent('Xin lỗi, hiện không thể tải giải thích. Vui lòng thử lại sau.');
    } finally {
      setIsModalLoading(false);
    }
  };

  const score = userAnswers.filter(a => a.isCorrect).length;

  const questionStatuses = useMemo(() => {
    if (questions.length === 0) {
      return [] as ('answered' | 'unanswered')[];
    }

    return questions.map((_, index) => (selectedAnswers[index] ? 'answered' : 'unanswered'));
  }, [questions, selectedAnswers]);

  const unansweredCount = useMemo(
    () => questionStatuses.filter(status => status === 'unanswered').length,
    [questionStatuses]
  );

  const activeQuestion =
    quizStatus === 'active' && questions.length > 0
      ? questions[Math.min(currentQuestionIndex, questions.length - 1)]
      : null;

  const isLoading = quizStatus === 'loading';
  const startButtonLabel = studentName ? `Tiếp tục với ${studentName}` : 'Bắt đầu làm bài';

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed top-6 right-6 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-lg backdrop-blur transition hover:border-sky-200 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-600"
      >
        Lịch sử bài làm
      </button>
      <main className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur md:p-10 dark:border-slate-700/60 dark:bg-slate-900/70">
        {quizStatus === 'idle' && (
          <section className="space-y-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Bắt đầu ôn luyện</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Kiểm tra Khoa học Tự nhiên 8 nâng cao</h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Hoàn thành {NUM_QUESTIONS_PER_QUIZ} câu hỏi trong 20 phút. Bạn có thể bỏ qua câu hỏi khó và quay lại sau, hệ thống sẽ nhắc nếu còn câu chưa trả lời khi nộp bài.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-500" />
                <span>Lưu lại mỗi lần làm bài cùng tên học sinh để tiện tra cứu lịch sử.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-500" />
                <span>Tự động nộp bài khi hết giờ, các câu bỏ trống được tính sai.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-amber-500" />
                <span>Nhấn “Lịch sử bài làm” để xem lại các lượt trước hoặc lọc theo tên.</span>
              </li>
            </ul>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setNameInput(studentName);
                  setNameError('');
                  setIsNamePromptVisible(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 dark:focus-visible:outline-sky-600"
              >
                {startButtonLabel}
              </button>
            </div>
          </section>
        )}
        {isLoading && (
          <section className="flex flex-col items-center gap-4 py-16 text-center text-slate-600 dark:text-slate-300">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" aria-hidden />
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Đang chuẩn bị câu hỏi…</p>
              <p className="mt-1 text-sm">Vui lòng chờ trong giây lát.</p>
            </div>
          </section>
        )}
        {quizStatus === 'active' && activeQuestion && (
          <QuizView
            question={activeQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswers[currentQuestionIndex] ?? null}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            canGoPrevious={currentQuestionIndex > 0}
            canGoNext={currentQuestionIndex < questions.length - 1}
            onSubmitQuiz={handleSubmitQuiz}
            questionStatuses={questionStatuses}
            onJumpToQuestion={handleJumpToQuestion}
            activeQuestionIndex={currentQuestionIndex}
            timeRemaining={timeRemaining}
            totalDurationSeconds={QUIZ_DURATION_SECONDS}
            studentName={studentName}
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
            unansweredCount={unansweredCount}
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
      {isWarningVisible && (
        <div className="pointer-events-none fixed top-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">
          Chỉ còn 2 phút 30 giây! Hãy nhanh chóng hoàn thành bài làm.
        </div>
      )}
      {isNamePromptVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-name-title"
            aria-describedby="student-name-description"
          >
            <h2 id="student-name-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Nhập tên học sinh
            </h2>
            <p id="student-name-description" className="mt-2 text-sm text-slate-600 dark:text-slate-300">
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
      {submissionPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-warning-title"
            aria-describedby="submission-warning-description"
          >
            <h2 id="submission-warning-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Còn câu hỏi chưa trả lời
            </h2>
            <p id="submission-warning-description" className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Bạn vẫn còn {submissionPrompt.unansweredCount} câu hỏi chưa trả lời. Bạn muốn nộp bài ngay bây giờ hay quay lại hoàn thành các câu hỏi này?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReturnToUnanswered}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Quay lại câu chưa làm
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;