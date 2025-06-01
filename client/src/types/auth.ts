export type UserRole = 'therapist' | 'patient' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
  }

  export enum AuthStatus {
    IDLE = 'idle',
    LOADING = 'loading', 
    SUCCESS = 'success',
    ERROR = 'error'
  }
  
  export interface AuthState {
    user: User | null;
    status: AuthStatus;
    error: string | null;
    isAuthenticated: boolean;
  }

  export interface ApiError {
    message: string;
    statusCode?: number;
    details?: string[];
  }