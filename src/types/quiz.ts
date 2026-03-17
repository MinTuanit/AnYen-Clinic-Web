import { Question } from './QuizTypes';

export interface Quiz {
  test_id: string;
  title: string;
  description?: string;
  createdAt?: string;
}

export interface QuizResult {
  test_id: string;
  patient_id: string;
  score: number;
  result_text: string;
  createdAt: string;
}

export interface QuizSubmission {
  test_id: string;
  answers: {
    question_id: string;
    score: number;
  }[];
}
