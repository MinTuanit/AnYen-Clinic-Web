import { Address } from './address';

export interface DoctorUser {
  id: string;
  phone_number: string;
  active_status: boolean;
  name: string;
  avatar_url: string;
  role_value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  doctor_id: string;
  user: DoctorUser;
  active_status: boolean;
  gender: string;
  specialization: string;
  workplace: string;
  year_experience: number;
  work_experience: string;
  education_history: string;
  price: string;
  info_status: string;
  appointment_count: number;
  approval_status: string;
  average_satisfaction: number;
  review_count: number;
  certification_urls: string[];
  paypal_email: string;
  paypal_verified: boolean;
  address: Address;
}
