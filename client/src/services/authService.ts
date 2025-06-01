import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (error) {
        // If refresh fails, logout user
        logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw error;
  }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}; 