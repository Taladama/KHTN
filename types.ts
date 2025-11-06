export interface Question {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct: 'a' | 'b' | 'c' | 'd';
  explanation: string;
}

export type QuizStatus = 'loading' | 'active' | 'finished';

export interface UserAnswer {
  question: string;
  answerKey: 'a' | 'b' | 'c' | 'd';
  answerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
  questionData: Question;
}