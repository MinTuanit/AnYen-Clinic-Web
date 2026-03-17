import { apiClient } from './apiClient';
import { Diary } from '../types/diary';

export const diaryService = {
  createDiary: async (diaryData: { diary_title: string; diary_text: string; mood: string }): Promise<any> => {
    const response = await apiClient.post('/patient/diary', diaryData);
    return response.data;
  },

  getDiariesByPatientId: async (): Promise<Diary[]> => {
    const response = await apiClient.get('/patient/diary');
    return response.data;
  },

  getDiaryById: async (diaryId: string): Promise<Diary> => {
    const response = await apiClient.get(`/patient/diary/${diaryId}`);
    return response.data;
  },

  updateDiary: async (diaryId: string, diaryData: Partial<Diary>): Promise<any> => {
    const response = await apiClient.put('/patient/diary', diaryData, { params: { diary_id: diaryId } });
    return response.data;
  },

  deleteDiary: async (diaryId: string): Promise<any> => {
    const response = await apiClient.delete('/patient/diary', { params: { diary_id: diaryId } });
    return response.data;
  },
};
