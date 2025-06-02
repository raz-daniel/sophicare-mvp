
import httpClient from '../httpClient';
import type { Appointment, CreateAppointmentData } from '../../types/appointment';

export const appointmentService = {
  // Create new appointment
  create: async (data: CreateAppointmentData): Promise<Appointment> => {
    const response = await httpClient.post('/appointments', data);
    return response.data;
  },

  // Get all appointments (with optional filters)
  getAll: async (filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{ appointments: Appointment[]; count: number }> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const response = await httpClient.get(`/appointments?${params.toString()}`);
    return response.data;
  },

  // Get appointments for a specific date range (useful for calendar)
  getByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    const response = await appointmentService.getAll({ startDate, endDate });
    return response.appointments;
  },

  // Get single appointment by ID
  getById: async (id: string): Promise<Appointment> => {
    const response = await httpClient.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment
  update: async (id: string, data: Partial<CreateAppointmentData>): Promise<Appointment> => {
    const response = await httpClient.put(`/appointments/${id}`, data);
    return response.data;
  },

  // Delete appointment (soft delete - sets status to cancelled)
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await httpClient.delete(`/appointments/${id}`);
    return response.data;
  },

  // Helper: Get today's appointments
  getToday: async (): Promise<Appointment[]> => {
    const today = new Date().toISOString().split('T')[0];
    return appointmentService.getByDateRange(today, today);
  },

  // Helper: Get this week's appointments
  getThisWeek: async (): Promise<Appointment[]> => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return appointmentService.getByDateRange(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    );
  }
};