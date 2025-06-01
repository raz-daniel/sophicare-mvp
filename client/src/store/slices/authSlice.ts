import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthStatus, type AuthState, type LoginCredentials, type RegisterCredentials } from '../../types/auth';
import * as authService from '../../services/authService';
import { getStoredTokens } from '../../services/authService';

const { accessToken } = getStoredTokens();

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!accessToken, 
  status: AuthStatus.IDLE,         
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.status = AuthStatus.IDLE;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCESS;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCESS;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 