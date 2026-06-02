import axios from 'axios';
import { apiClient } from './apiClient';
import { config } from '../config/config';
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
  },
  
  registerPatient: async (patient: any) => {
    const registerResponse = await apiClient.post('/auth-patient/register', {
      phone_number: patient.phone_number,
      password: patient.password,
    });

    if (registerResponse.data?.err !== 0) {
      return registerResponse;
    }

    const loginResponse = await apiClient.post('/auth/login', {
      phone_number: patient.phone_number,
      password: patient.password,
    });

    const patientClient = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: loginResponse.data.access_token,
      },
    });

    await patientClient.patch('/patient/edit-profile', {
      name: patient.name || undefined,
      dateOfBirth: patient.date_of_birth || undefined,
      gender: patient.gender || undefined,
      medicalHistory: patient.medical_history || undefined,
      allergies: patient.allergies || undefined,
      email: patient.email || undefined,
    });

    if (patient.anonymous_name) {
      await patientClient.patch('/patient/edit-anonymousName', {
        anonymous_name: patient.anonymous_name,
      });
    }

    if (patient.emergency_contact) {
      await patientClient.post('/patient/emergency-contact', {
        emergency_contact: patient.emergency_contact,
        emergency_email: patient.email || undefined,
      });
    }

    return registerResponse;
  }
};
