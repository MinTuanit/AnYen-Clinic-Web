export interface Voucher {
  id: string;
  code: string;
  description: string;
  discount_type: 'Percent' | 'Fixed';
  discount_value: number;
  max_discount?: number;
  min_order_value: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  applicable_to: 'Appointment' | 'Order';
  discount_scope: 'Appointment' | 'Drug' | 'Shipping';
  status?: 'Active' | 'Inactive' | 'Expired' | 'Exhausted';
  createdAt?: string;
}
