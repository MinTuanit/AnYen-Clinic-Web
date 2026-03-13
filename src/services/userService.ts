import { apiClient } from './apiClient';
import { User } from '../types/user';

export const userService = {
  checkLogin: async (phoneNumber: string, password: string) => {
    return apiClient.post('/auth/check-login', { phone_number: phoneNumber, password });
  },

  login: async (phoneNumber: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/login', { 
      phone_number: phoneNumber, 
      password 
    });
    
    const { access_token, refresh_token, data } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    return data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  getUser: async (): Promise<User> => {
    const response = await apiClient.get('/get/user');
    return response.data.data;
  },

  register: async (phone: string, password: string) => {
    return apiClient.post('/auth-patient/register', { 
      phone_number: phone, 
      password 
    });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return apiClient.post('/auth/reset-pass', { oldPassword, newPassword });
  },

  editAdmin: async (user: Partial<User>) => {
    return apiClient.post('/admin/edit-profile', { name: user.name });
  },

  uploadAvatarAdmin: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/admin/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
};
