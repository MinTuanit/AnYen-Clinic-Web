import { apiClient } from './apiClient';

export const chatbotService = {
  chat: async (message: string): Promise<any> => {
    const response = await apiClient.post('/chatbot', { message });
    return response.data;
  },
};
