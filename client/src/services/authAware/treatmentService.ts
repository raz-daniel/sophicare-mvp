// services/treatmentService.ts
import httpClient from '../httpClient';
import type { Treatment, CreateTreatmentData } from '../../types/treatment';

interface TreatmentResponse {
  treatments: Treatment[];
  count: number;
}

interface HighlightedNotesResponse {
  highlights: Array<{
    treatmentId: string;
    treatmentDate: string;
    type: 'patientNote' | 'treatmentNote';
    text: string;
    createdAt: string;
  }>;
  count: number;
}

interface ActiveHomeworkResponse {
  homework: Array<{
    treatmentId: string;
    treatmentDate: string;
    task: string;
    assignedTo: string;
    status: string;
    notes?: string;
  }>;
  count: number;
}

interface UpdateHomeworkData {
  homeworkIndex: number;
  status: string;
  notes?: string;
}

export const treatmentService = {
  // Create treatment for specific patient
  create: async (patientId: string, data: CreateTreatmentData): Promise<Treatment> => {
    const response = await httpClient.post(`/treatments/patient/${patientId}`, data);
    return response.data;
  },

  // Get all treatments for a patient
  getByPatient: async (patientId: string): Promise<TreatmentResponse> => {
    const response = await httpClient.get(`/treatments/patient/${patientId}`);
    return response.data;
  },

  // Get single treatment
  getById: async (id: string): Promise<Treatment> => {
    const response = await httpClient.get(`/treatments/${id}`);
    return response.data;
  },

  // Update treatment
  update: async (id: string, data: Partial<CreateTreatmentData>): Promise<Treatment> => {
    const response = await httpClient.put(`/treatments/${id}`, data);
    return response.data;
  },

  // Delete treatment (soft delete - sets status to cancelled)
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await httpClient.delete(`/treatments/${id}`);
    return response.data;
  },

  // Get highlighted notes for patient across all treatments
  getHighlightedNotes: async (patientId: string): Promise<HighlightedNotesResponse> => {
    const response = await httpClient.get(`/treatments/patient/${patientId}/highlights`);
    return response.data;
  },

  // Get active homework for patient across all treatments
  getActiveHomework: async (patientId: string): Promise<ActiveHomeworkResponse> => {
    const response = await httpClient.get(`/treatments/patient/${patientId}/homework`);
    return response.data;
  },

  // Update homework status for specific homework item
  updateHomeworkStatus: async (treatmentId: string, homeworkData: UpdateHomeworkData): Promise<any> => {
    const response = await httpClient.put(`/treatments/${treatmentId}/homework`, homeworkData);
    return response.data;
  }
};