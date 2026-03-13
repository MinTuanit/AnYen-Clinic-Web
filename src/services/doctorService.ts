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
    return apiClient.post('/admin/create-doctor', {
      phone: doctor.phone || doctor.phone_number,
      name: doctor.name,
      password: doctor.password,
      gender: doctor.gender === 'Nữ' || doctor.gender === 'Female' ? 'Female' : 'Male',
      specialization: doctor.specialization,
      workplace: doctor.workplace,
      year_experience: Number(doctor.year_experience || doctor.yearExperience),
      work_experience: doctor.work_experience || doctor.workExperience,
      info_status: doctor.info_status || doctor.infoStatus || 'Active',
      education_history: doctor.education_history || doctor.educationHistory,
      price: String(doctor.price),
      province_code: doctor.address?.province_code || doctor.province_code,
      ward_code: doctor.address?.ward_code || doctor.ward_code,
      street: doctor.address?.street || doctor.street,
      certification_urls: doctor.certification_urls || []
    });
  },

  editDoctor: async (doctor: any) => {
    const docId = doctor.doctor_id || doctor.doctorId;
    return apiClient.patch('/admin/edit-doctor', {
      user_id: docId,
      phone: doctor.phone || doctor.user?.phone_number || doctor.phone_number,
      name: doctor.name || doctor.user?.name,
      password: doctor.password || undefined,
      gender: doctor.gender === 'Nữ' || doctor.gender === 'Female' ? 'Female' : 'Male',
      specialization: doctor.specialization,
      workplace: doctor.workplace,
      year_experience: Number(doctor.year_experience || doctor.yearExperience),
      work_experience: doctor.work_experience || doctor.workExperience,
      info_status: doctor.info_status || doctor.infoStatus,
      education_history: doctor.education_history || doctor.educationHistory,
      price: String(doctor.price),
      approval_status: doctor.approval_status || doctor.approvalStatus,
      province_code: doctor.address?.province_code || doctor.address?.provinceCode || doctor.province_code,
      ward_code: doctor.address?.ward_code || doctor.address?.wardCode || doctor.ward_code,
      street: doctor.address?.street || doctor.street,
      certification_urls: doctor.certification_urls || []
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
