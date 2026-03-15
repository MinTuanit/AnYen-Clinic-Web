import { apiClient } from './apiClient';
import { Doctor } from '../types/doctor';

export const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get('/get/get-all-doctors');
    return response.data.data;
  },

  getDoctor: async (doctorId: string): Promise<Doctor> => {
    const response = await apiClient.get(`/get/doctor/?user_id=${doctorId}`);
    return response.data.data;
  },

  getApprovedDoctor: async (doctorId: string): Promise<Doctor> => {
    const response = await apiClient.get(`/get/approved-doctor/?user_id=${doctorId}`);
    return response.data.data;
  },

  getUnapprovedDoctor: async (doctorId: string): Promise<Doctor> => {
    const response = await apiClient.get(`/get/unapproved-doctor/?user_id=${doctorId}`);
    return response.data.data;
  },

  createDoctor: async (doctor: any) => {
    // Step 1: Register Account
    const regRes = await apiClient.post('/doctor/register', {
      phone_number: doctor.phone || doctor.phone_number,
      password: doctor.password,
    });

    if (regRes.data.err !== 0) return regRes;

    const doctorId = regRes.data.data.id;

    // Step 2: Add Doctor Details
    return apiClient.post('/doctor/add-doctor', {
      doctor_id: doctorId,
      name: doctor.name,
      gender: doctor.gender,
      specialization: doctor.specialization,
      workplace: doctor.workplace,
      yearExperience: Number(doctor.year_experience || doctor.yearExperience),
      workExperience: doctor.work_experience || doctor.workExperience,
      infoStatus: doctor.info_status || doctor.infoStatus || 'Active',
      educationHistory: doctor.education_history || doctor.educationHistory,
      price: String(doctor.price),
      province_code: doctor.address?.province_code || doctor.province_code,
      ward_code: doctor.address?.ward_code || doctor.ward_code,
      street: doctor.address?.street || doctor.street,
    });
  },

  editDoctor: async (doctor: any) => {
    const docId = doctor.doctor_id || doctor.doctorId;
    return apiClient.patch('/doctor/edit-doctor', {
      user_id: docId,
      phone: doctor.phone || doctor.user?.phone_number || doctor.phone_number,
      name: doctor.name || doctor.user?.name,
      password: doctor.password || undefined,
      gender: doctor.gender,
      specialization: doctor.specialization,
      workplace: doctor.workplace,
      yearExperience: Number(doctor.year_experience || doctor.yearExperience),
      workExperience: doctor.work_experience || doctor.workExperience,
      infoStatus: doctor.info_status || doctor.infoStatus,
      educationHistory: doctor.education_history || doctor.educationHistory,
      price: String(doctor.price),
      approval_status: doctor.approval_status || doctor.approvalStatus,
      province_code: doctor.address?.province_code || doctor.address?.provinceCode || doctor.province_code,
      ward_code: doctor.address?.ward_code || doctor.address?.wardCode || doctor.ward_code,
      street: doctor.address?.street || doctor.street,
      certification_urls: doctor.certification_urls || []
    });
  },

  deleteDoctor: async (doctorId: string) => {
    return apiClient.delete(`/admin/delete-doctor`, {
      data: { user_id: doctorId }
    });
  },

  uploadAvatarDoctor: async (file: File, userId: string) => {
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', userId);
    return apiClient.post('/admin/upload-avatar-doctor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
};
