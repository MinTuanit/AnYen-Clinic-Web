import { Address } from './address';

export interface HealthRecord {
  id: string;
  recordDate: string;
  height: number;
  weight: number;
  note?: string;
}

export interface Patient {
  patientId?: string;
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  anonymousName?: string;
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
