import { apiClient } from './apiClient';
import { Review } from '../types/review';

export const reviewService = {
  createReview: async (reviewData: Partial<Review>): Promise<any> => {
    const response = await apiClient.post('/review', reviewData);
    return response.data;
  },

  editReview: async (reviewData: Partial<Review>): Promise<any> => {
    const response = await apiClient.put('/review', reviewData);
    return response.data;
  },

  pressHelpful: async (reviewId: string): Promise<any> => {
    const response = await apiClient.post('/review/helpful', { review_id: reviewId });
    return response.data;
  },

  pressReport: async (reviewId: string): Promise<any> => {
    const response = await apiClient.post('/review/report', { review_id: reviewId });
    return response.data;
  },

  getPatientReview: async (reviewId: string): Promise<Review> => {
    const response = await apiClient.get('/review/patient-review', { params: { review_id: reviewId } });
    return response.data;
  },

  getAllDoctorReviews: async (doctorId: string): Promise<Review[]> => {
    const response = await apiClient.get('/review/doctor-reviews', { params: { doctor_id: doctorId } });
    return response.data;
  },

  deleteReview: async (reviewId: string): Promise<any> => {
    const response = await apiClient.delete('/review', { params: { review_id: reviewId } });
    return response.data;
  },
};
