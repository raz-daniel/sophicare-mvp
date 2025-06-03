
import httpClient from '../httpClient';
import type { Patient, CreatePatientData } from '../../types/patient';

export const patientService = {
  // Create new patient
  create: async (data: CreatePatientData): Promise<Patient> => {
    const response = await httpClient.post('/patients', data);
    return response.data;
  },

  // Get all patients
  getAll: async (): Promise<{ patients: Patient[]; count: number }> => {
    const response = await httpClient.get('/patients');
    return response.data;
  },

  // Get patient by ID - MISSING METHOD
  getById: async (id: string): Promise<Patient> => {
    const response = await httpClient.get(`/patients/${id}`);
    return response.data;
  },

  // Update patient - MISSING METHOD
  update: async (id: string, data: Partial<CreatePatientData>): Promise<Patient> => {
    const response = await httpClient.put(`/patients/${id}`, data);
    return response.data;
  },

  // Delete patient (soft delete) - MISSING METHOD
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await httpClient.delete(`/patients/${id}`);
    return response.data;
  }
};