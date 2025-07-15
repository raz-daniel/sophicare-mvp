import axios from 'axios';
import { tokenService } from './tokenService';
import { ROUTES } from '../../constants/routes';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-production-e9723.up.railway.app';


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
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await httpClient.post('/auth/refresh', { refreshToken });
          tokenService.setTokens(response.data.accessToken, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return httpClient(originalRequest);
        } catch {
          // Fall through to cleanup
        }
      }
      
      // Cleanup for both "no refresh token" and "refresh failed"
      tokenService.clearTokens();
      window.location.href = ROUTES.AUTH;
      return Promise.reject(error);
    }
    
    // For non-401 errors, just reject
    return Promise.reject(error);
  }
);
export default httpClient;