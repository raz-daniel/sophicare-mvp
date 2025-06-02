
import axios from 'axios';
import { tokenService } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
console.log('API_URL:', API_URL);

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);


httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenService.getRefreshToken();
        const response = await httpClient.post('/auth/refresh', { refreshToken });
        
        tokenService.setTokens(response.data.accessToken, refreshToken!);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        
        return httpClient(originalRequest);
      } catch {
        tokenService.clearTokens();
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;