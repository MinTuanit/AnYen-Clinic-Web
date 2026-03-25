import { apiClient } from './apiClient';
import { Order, OrderStatus } from '../types/order';

export const orderService = {
  getAllOrders: async (params?: { statuses?: string; limit?: number; offset?: number }): Promise<Order[]> => {
    const response = await apiClient.get('/admin/order', { params });
    return response.data.data;
  },

  getOrdersByPatient: async (params?: { statuses?: string; limit?: number; offset?: number }): Promise<Order[]> => {
    const response = await apiClient.get('/patient/order', { params });
    return response.data.data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/admin/order/${orderId}`);
    return response.data.data;
  },

  createOrder: async (orderData: {
    prescription_id: string;
    voucher_id?: string;
    delivery_address?: string;
    payment_method?: string;
  }): Promise<any> => {
    const response = await apiClient.post('/patient/order', orderData);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<any> => {
    const response = await apiClient.put(`/admin/order/${orderId}`, { status });
    return response.data;
  },

  cancelOrder: async (orderId: string, reason?: string): Promise<any> => {
    const response = await apiClient.post(`/patient/order/cancel/${orderId}`, { reason });
    return response.data;
  },

  returnOrder: async (orderId: string, reason?: string): Promise<any> => {
    const response = await apiClient.post(`/patient/order/return/${orderId}`, { reason });
    return response.data;
  },

  approveOrderToDelivering: async (orderId: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/order/${orderId}/approve-delivering`);
    return response.data;
  },

  approveOrderToReturning: async (orderId: string): Promise<any> => {
    const response = await apiClient.patch(`/admin/order/${orderId}/approve-returning`);
    return response.data;
  },

  deleteOrder: async (orderId: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/order/${orderId}`);
    return response.data;
  },
};
