import { apiClient } from './apiClient';
import { Appointment } from '../types/appointment';

export const appointmentService = {
  getAllAppointmentAdmin: async (): Promise<Appointment[]> => {
    const response = await apiClient.get('/admin/get-all-appointments');
    return response.data.data;
  },

  getAppointmentAdmin: async (appointmentId: string): Promise<Appointment> => {
    const response = await apiClient.get(`/admin/get-appointment?appointment_id=${appointmentId}`);
    return response.data.data;
  },

  editAppointmentTime: async (appointment: Appointment) => {
    return apiClient.patch('/admin/edit-appointment', {
      appointment_id: appointment.id,
      appointment_time: appointment.appointment_time,
      appointment_date: appointment.appointment_date,
    });
  },

  editAppointmentStatus: async (appointmentId: string, status: string = 'Pending') => {
    return apiClient.patch('/admin/edit-appointment', {
      appointment_id: appointmentId,
      status: status,
    });
  },

  payAppointmentForDoctor: async (appointmentId: string, commissionRate: number) => {
    return apiClient.patch('/admin/pay-appointment', {
      appointment_id: appointmentId,
      commission_rate: commissionRate,
    });
  },

  cancelAppointment: async (appointment: Appointment) => {
    return apiClient.patch('/admin/edit-appointment', {
      status: 'Canceled',
      doctor_id: appointment.doctor?.doctor_id,
      appointment_id: appointment.id,
      cancel_reason: appointment.cancel_reason,
    });
  },

  getPrescriptions: async (appointmentId: string): Promise<Appointment> => {
    const response = await apiClient.get(`/get/get-prescription/?appointment_id=${appointmentId}`);
    return response.data.data;
  }
};
