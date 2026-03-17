import { apiClient } from './apiClient';
import { Voucher } from '../types/voucher';

export const voucherService = {
  getAdminVouchers: async (): Promise<Voucher[]> => {
    const response = await apiClient.get('/admin/voucher');
    return response.data.data;
  },

  getAllPatientVouchers: async (params?: { applicable_to?: string }): Promise<Voucher[]> => {
    const response = await apiClient.get('/voucher/patient/all', { params });
    return response.data.data;
  },

  createVoucher: async (data: Partial<Voucher>): Promise<any> => {
    const response = await apiClient.post('/admin/voucher', data);
    return response.data;
  },

  deleteVoucher: async (voucherId: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/voucher/${voucherId}`);
    return response.data;
  },
};
