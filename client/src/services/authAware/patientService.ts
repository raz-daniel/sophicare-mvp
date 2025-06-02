// services/patientService.ts
import httpClient from '../httpClient';
import type { Patient, CreatePatientData } from '../../types/patient';

export const patientService = {
  create: async (data: CreatePatientData): Promise<Patient> => {
    const response = await httpClient.post('/patients', data);
    return response.data;
  },

  getAll: async (): Promise<{ patients: Patient[]; count: number }> => {
    const response = await httpClient.get('/patients');
    return response.data;
  },

  // ... other methods
};