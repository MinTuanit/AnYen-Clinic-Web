export interface Voucher {
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
}
