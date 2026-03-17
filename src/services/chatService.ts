import { apiClient } from './apiClient';

export const chatService = {
  getMessages: async (conversationId: string): Promise<any> => {
    const response = await apiClient.get(`/chat/messages/${conversationId}`);
    return response.data;
  },

  getConversationByAppointment: async (appointmentId: string): Promise<any> => {
    const response = await apiClient.get('/chat/get-conversation-appointment', { params: { appointment_id: appointmentId } });
    return response.data;
  },

  createConversation: async (data: { user_id2: string; appointment_id?: string }): Promise<any> => {
    const response = await apiClient.post('/chat/create-conversation', data);
    return response.data;
  },

  sendMessageText: async (data: { conversation_id: string; content: string }): Promise<any> => {
    const response = await apiClient.post('/chat/send-message-text', data);
    return response.data;
  },

  sendImage: async (conversationId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', conversationId);
    const response = await apiClient.post('/chat/send-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  sendAudio: async (conversationId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_id', conversationId);
    const response = await apiClient.post('/chat/send-audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAllSupportConversations: async (): Promise<any> => {
    const response = await apiClient.get('/admin/support-conversations');
    return response.data;
  },

  getSupportConversationMessages: async (conversationId: string): Promise<any> => {
    const response = await apiClient.get(`/chat/conversation/${conversationId}/messages`);
    return response.data;
  }
};
