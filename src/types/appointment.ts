import { Patient } from './patient';
import { Doctor } from './doctor';

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
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
  appointmentDate?: string;
  appointmentTime?: string;
  question?: string;
  status?: string;
  cancelReason?: string;
  description?: string;
  noteForAdmin?: string;
  createdAt?: string;
  payment?: Payment;
  review?: Review;
  paymentAmount?: string; // Using string for BigInt representation
  doctorPaymentStatus?: string;
  commissionRate?: number;
  prescriptions?: Prescription[];
  paidAt?: string;
}
