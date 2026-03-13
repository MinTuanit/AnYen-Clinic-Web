import { apiClient } from './apiClient';
import { Patient, HealthRecord } from '../types/patient';

export const patientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await apiClient.get('/admin/get-all-patients');
    return response.data.data;
  },

  getPatientProfile: async (patientId: string): Promise<Patient> => {
    const response = await apiClient.get(`/get/get-patient-profile/?patientId=${patientId}`);
    return response.data.data;
  },

  getHealthRecords: async (patientId: string): Promise<HealthRecord[]> => {
    const response = await apiClient.get(`/get/get-patient-health-records/?patientId=${patientId}`);
    return response.data.data;
  },

  addHealthRecord: async (patientId: string, record: Partial<HealthRecord>) => {
    return apiClient.post('/patient/health-records', {
      recordDate: record.recordDate,
      height: record.height,
      weight: record.weight,
    });
  },

  deleteHealthRecord: async (recordId: string) => {
    return apiClient.delete('/patient/health-records', { data: { id: recordId } });
  },

  editProfile: async (patient: Patient) => {
    return apiClient.patch('/patient/edit-profile', {
      name: patient.name,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
    });
  },

  uploadAvatarPatient: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/patient/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  saveEmergencyPhone: async (phone: string) => {
    return apiClient.post('/patient/emergency-contact', {
      emergency_contact: phone,
    });
  }
};
