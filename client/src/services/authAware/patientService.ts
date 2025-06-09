import httpClient from '../auth/httpClient';
import type { Patient, CreatePatientData } from '../../types/patient';

export const patientService = {
  create: async (data: CreatePatientData): Promise<Patient> => {
    const response = await httpClient.post('/pro/patients', data);
    return response.data;
  },

  getAll: async (): Promise<{ patients: Patient[]; count: number }> => {
    const response = await httpClient.get('/pro/patients');
    return response.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await httpClient.get(`/pro/patients/${id}`);
    return response.data;
  },
};