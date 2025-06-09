import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types/auth';
import httpClient from './httpClient';
import { tokenService } from './tokenService';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
  tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/register', credentials);
  tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
  return response.data;
};

export const logout = () => {
  tokenService.clearTokens();
};