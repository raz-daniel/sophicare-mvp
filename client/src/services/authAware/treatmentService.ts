import httpClient from '../auth/httpClient';
import type { Treatment, CreateTreatmentData } from '../../types/treatment';

interface TreatmentResponse {
  treatments: Treatment[];
  count: number;
}

export const treatmentService = {
  create: async (patientId: string, data: CreateTreatmentData): Promise<Treatment> => {
    const response = await httpClient.post(`/pro/patients/${patientId}/treatments`, data);
    return response.data;
  },

  getById: async (id: string): Promise<Treatment> => {
    const response = await httpClient.get(`/pro/treatments/${id}`);
    return response.data;
  },

  getByPatient: async (patientId: string): Promise<TreatmentResponse> => {
    const response = await httpClient.get(`/pro/patients/${patientId}/treatments`);
    return response.data;
  }
};