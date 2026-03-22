import { apiClient } from './apiClient';
import { Quiz, QuizSubmission } from '../types/quiz';

export const quizService = {
  // Patient endpoints
  submitAnswers: async (submission: QuizSubmission): Promise<any> => {
    const response = await apiClient.post('/patient/test/submit-answers', submission);
    return response.data;
  },

  getAllAnsweredTests: async (): Promise<any> => {
    const response = await apiClient.get('/patient/test/results');
    return response.data;
  },

  getAllUnansweredTests: async (): Promise<any> => {
    const response = await apiClient.get('/patient/test');
    return response.data;
  },

  getTestByTestId: async (testId: string): Promise<any> => {
    const response = await apiClient.get(`/patient/test/${testId}`);
    return response.data;
  },

  getAnsweredTestByTestId: async (testId: string): Promise<any> => {
    const response = await apiClient.get(`/patient/test/results/${testId}`);
    return response.data;
  },

  // Admin endpoints
  createTest: async (testData: Partial<Quiz>): Promise<any> => {
    const response = await apiClient.post('/admin/test', testData);
    return response.data;
  },

  deleteTest: async (testId: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/test/remove/${testId}`);
    return response.data;
  },

  updateTest: async (testId: string, testData: Partial<Quiz>): Promise<any> => {
    const response = await apiClient.put(`/admin/test/update/${testId}`, testData);
    return response.data;
  },

  getAllTests: async (): Promise<any> => {
    const response = await apiClient.get('/admin/test/all-test');
    return response.data;
  },

  getQuestionSetsByTestId: async (testId: string): Promise<any> => {
    const response = await apiClient.get(`/admin/test/${testId}`);
    return response.data;
  },

  addQuestions: async (testId: string, questions: any[]): Promise<any> => {
    const response = await apiClient.post(`/admin/test/${testId}/questions`, { questions });
    return response.data;
  }
};
