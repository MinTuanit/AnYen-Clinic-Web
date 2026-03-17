import { Address } from './address';

export interface HealthRecord {
  id: string;
  recordDate: string;
  height: number;
  weight: number;
  note?: string;
}

export interface Patient {
  patient_id?: string;
  patientId?: string; // Keep for backward compatibility if needed
  name?: string;
  user?: {
    id: string;
    name: string;
    phone_number: string;
    avatar_url?: string;
    active_status?: boolean;
  };
  phoneNumber?: string;
  avatarUrl?: string;
  anonymous_name?: string;
  anonymousName?: string;
  date_of_birth?: string;
  dateOfBirth?: string;
  gender: string;
  medicalHistory: string;
  emergencyContact: string;
  allergies: string;
  healthRecords: HealthRecord[];
  reviewCount?: number;
  appointmentCount?: number;
  address?: Address;
}
