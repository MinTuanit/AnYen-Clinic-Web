import { apiClient } from './apiClient';
import { Prescription, PrescriptionDetail } from '../types/prescription';

export const prescriptionService = {
  createPrescription: async (prescriptionData: { appointment_id: string; details: PrescriptionDetail[] }): Promise<any> => {
    const response = await apiClient.post('/doctor/prescription', prescriptionData);
    return response.data;
  },

  getPrescriptionByAppointmentId: async (appointmentId: string): Promise<Prescription> => {
    const response = await apiClient.get('/doctor/prescription', { params: { appointment_id: appointmentId } });
    return response.data;
  },

  getPrescriptionById: async (prescriptionId: string): Promise<Prescription> => {
    const response = await apiClient.get(`/doctor/prescription/${prescriptionId}`);
    return response.data;
  },

  updatePrescription: async (prescriptionId: string, details: PrescriptionDetail[]): Promise<any> => {
    const response = await apiClient.put(`/doctor/prescription/${prescriptionId}`, { details });
    return response.data;
  },

  deletePrescription: async (prescriptionId: string): Promise<any> => {
    const response = await apiClient.delete(`/doctor/prescription/${prescriptionId}`);
    return response.data;
  },
};
