import { apiClient } from './apiClient';
import { DrugImport } from '../types/drugImport';

export const drugImportService = {
  getAllDrugImports: async (params?: { drug_id?: string; limit?: number; offset?: number; month?: number; year?: number }): Promise<DrugImport[]> => {
    const response = await apiClient.get('/admin/drug-import', { params });
    // Based on common pattern in this project, response.data.rows might be where the data is, 
    // or response.data.data. Let's assume it's response.data.data or response.data based on drugService.
    return response.data.data;
  },

  getDrugImportById: async (id: string): Promise<DrugImport> => {
    const response = await apiClient.get(`/admin/drug-import/${id}`);
    return response.data.data;
  },

  createDrugImport: async (data: Partial<DrugImport>): Promise<any> => {
    const response = await apiClient.post('/admin/drug-import', data);
    return response.data;
  },

  updateDrugImport: async (id: string, data: Partial<DrugImport>): Promise<any> => {
    const response = await apiClient.put(`/admin/drug-import/${id}`, data);
    return response.data;
  },

  deleteDrugImport: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/drug-import/${id}`);
    return response.data;
  },
};
