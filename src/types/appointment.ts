import { Patient } from './patient';
import { Doctor } from './doctor';

export interface Payment {
  id: string;
  total_price: number;
  total_paid: number;
  payment_method: string;
  payment_status: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  instructions: string;
}

export interface Appointment {
  id: string;
  patient?: Patient;
  doctor?: Doctor;
  appointment_date?: string;
  appointment_time?: string;
  question?: string;
  status?: string;
  cancel_reason?: string;
  description?: string;
  note_for_admin?: string;
  createdAt?: string;
  payment?: Payment;
  review?: Review;
  paymentAmount?: string; // Using string for BigInt representation
  doctor_payment_status?: string;
  commission_rate?: number;
  prescriptions?: Prescription[];
  paidAt?: string;
}
