export type AnswerKey = 'a' | 'b' | 'c' | 'd';
export type RecordedAnswerKey = AnswerKey | 'unanswered';

export interface Question {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct: AnswerKey;
  explanation: string;
}

export type QuizStatus = 'idle' | 'loading' | 'active' | 'finished';

export interface UserAnswer {
  question: string;
  answerKey: RecordedAnswerKey;
  answerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
  questionData: Question;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  studentName: string;
}
