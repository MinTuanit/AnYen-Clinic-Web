import { apiClient } from './apiClient';

export const paymentService = {
  payDoctorByAppointment: async (appointmentId: string, commissionRate: number) => {
    try {
      const response = await apiClient.patch('/admin/pay-appointment', {
        appointment_id: appointmentId,
        commission_rate: commissionRate,
      });
      return response.data;
    } catch (error) {
      console.error('Error paying doctor:', error);
      throw error;
    }
  },
};
