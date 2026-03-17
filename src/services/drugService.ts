import { apiClient } from './apiClient';
import { Drug } from '../types/drug';

export const drugService = {
  getAllDrugs: async (params?: { search?: string; limit?: number; offset?: number }): Promise<Drug[]> => {
    const response = await apiClient.get('/admin/drug', { params });
    return response.data.data;
  },

  getDrugById: async (drugId: string): Promise<Drug> => {
    const response = await apiClient.get(`/admin/drug/${drugId}`);
    return response.data.data;
  },

  createDrug: async (drug: Partial<Drug>): Promise<any> => {
    const response = await apiClient.post('/admin/drug', drug);
    return response.data;
  },

  updateDrug: async (drugId: string, drug: Partial<Drug>): Promise<any> => {
    const response = await apiClient.put(`/admin/drug/${drugId}`, drug);
    return response.data;
  },

  deleteDrug: async (drugId: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/drug/${drugId}`);
    return response.data;
  },
};
