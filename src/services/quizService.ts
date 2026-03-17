import { apiClient } from './apiClient';
import { Quiz, QuizSubmission, QuizResult } from '../types/quiz';

export const quizService = {
  submitAnswers: async (submission: QuizSubmission): Promise<QuizResult> => {
    const response = await apiClient.post('/patient/test', submission);
    return response.data;
  },

  getAllAnsweredTests: async (): Promise<QuizResult[]> => {
    const response = await apiClient.get('/patient/test/answered');
    return response.data;
  },

  getAllUnansweredTests: async (): Promise<Quiz[]> => {
    const response = await apiClient.get('/patient/test/unanswered');
    return response.data;
  },

  getTestByTestId: async (testId: string): Promise<Quiz> => {
    const response = await apiClient.get(`/patient/test/${testId}`);
    return response.data;
  },

  createTest: async (testData: Partial<Quiz>): Promise<any> => {
    const response = await apiClient.post('/admin/test', testData);
    return response.data;
  },

  deleteTest: async (testId: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/test/${testId}`);
    return response.data;
  },

  getAllTests: async (): Promise<Quiz[]> => {
    const response = await apiClient.get('/admin/test');
    return response.data;
  },

  getQuestionSetsByTestId: async (testId: string) => {
    const response = await apiClient.get(`/admin/test/${testId}/questions`);
    return response.data;
  },

  addQuestions: async (testId: string, questions: any[]) => {
    const response = await apiClient.post(`/admin/test/${testId}/questions`, { questions });
    return response.data;
  }
};
