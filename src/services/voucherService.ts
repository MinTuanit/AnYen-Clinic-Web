import { apiClient } from './apiClient';
import { Voucher } from '../types/voucher';

export const voucherService = {
  getAllVouchers: async (): Promise<Voucher[]> => {
    const response = await apiClient.get('/admin/voucher');
    return response.data.data;
  },

  createVoucher: async (voucher: Partial<Voucher>) => {
    return apiClient.post('/admin/voucher', {
      code: voucher.code,
      description: voucher.description,
      discount_type: voucher.discountType,
      discount_value: voucher.discountValue,
      max_discount: voucher.maxDiscount,
      min_order_value: voucher.minOrderValue,
      usage_limit: voucher.usageLimit,
      expires_at: voucher.expiresAt,
    });
  },

  deleteVoucher: async (voucherId: string) => {
    return apiClient.delete(`/admin/voucher/${voucherId}`);
  }
};
