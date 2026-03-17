export interface Review {
  review_id: string;
  patient_id: string;
  appointment_id: string;
  rating: number;
  comment: string;
  helpful_count: number;
  report_count: number;
  createdAt: string;
  updatedAt: string;
}
