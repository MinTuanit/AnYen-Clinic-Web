export interface PrescriptionDetail {
  drug_id: string;
  amount: number;
  quantity: number;
  dosage?: string;
  note?: string;
  medicine_name?: string;
}

export interface Prescription {
  prescription_id: string;
  appointment_id: string;
  doctor_id: string;
  details: PrescriptionDetail[];
  createdAt?: string;
  updatedAt?: string;
}
