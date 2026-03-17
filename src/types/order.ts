export enum OrderStatus {
  Pending = 'Pending',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
  Returning = 'Returning',
  Returned = 'Returned',
  Cancelled = 'Cancelled',
}

export interface Order {
  order_id: string;
  patient_id: string;
  prescription_id: string;
  voucher_id?: string;
  payment_id?: string;
  delivery_address: string;
  payment_method: string;
  status: OrderStatus;
  total_amount?: number; 
  reason?: string;
  createdAt: string;
  updatedAt: string;
  patient?: any;
  prescription?: any;
  payment?: {
    id: string;
    total_price: number | string;
    total_paid: number | string;
    payment_status: string;
    payment_method: string;
  };
}
