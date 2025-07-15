
import httpClient from '../auth/httpClient';
import type { Appointment, CreateAppointmentData } from '../../types/appointment';

export const appointmentService = {
  create: async (data: CreateAppointmentData): Promise<Appointment> => {
    const response = await httpClient.post('/pro/appointments', data);
    return response.data;
  },

  getAll: async (filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{ appointments: Appointment[]; count: number }> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const response = await httpClient.get(`/pro/appointments?${params.toString()}`);
    return response.data;
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
    const response = await appointmentService.getAll({ startDate, endDate });
    return response.appointments;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await httpClient.get(`/pro/appointments/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateAppointmentData>): Promise<Appointment> => {
    const response = await httpClient.put(`/pro/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await httpClient.delete(`/pro/appointments/${id}`);
    return response.data;
  },

  getToday: async (): Promise<Appointment[]> => {
    const today = new Date().toISOString().split('T')[0];
    return appointmentService.getByDateRange(today, today);
  },

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