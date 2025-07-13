import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthStatus, type AuthState, type LoginCredentials, type RegisterCredentials } from '../../types/auth';
import * as authService from '../../services/auth/authService';
import { tokenService } from '../../services/auth/tokenService';
import httpClient from '../../services/auth/httpClient';
import { ROUTES } from '../../constants/routes';

const initialState: AuthState = {
  user: null,
  activeRole: null,
  isAuthenticated: false,
  status: AuthStatus.IDLE,
  error: null,
};

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(ROUTES.API.AUTH_ME);
      return response.data.user;
    } catch (error) {
      tokenService.clearTokens();
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
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
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (googleToken: string, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(googleToken);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const setUserAndRole = (state: AuthState, user: AuthState['user']) => {
  state.user = user;
  if (user && user.role.length === 1) {
    state.activeRole = user.role[0];
  } else {
    state.activeRole = null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      if (state.user && state.user.role.includes(action.payload)) {
        state.activeRole = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.activeRole = null;
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
      .addCase(getCurrentUser.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCESS;
        state.isAuthenticated = true;
        setUserAndRole(state, action.payload);
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.status = AuthStatus.ERROR;
        state.isAuthenticated = false;
        state.user = null;
        state.activeRole = null;
      })
      .addCase(login.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCESS;
        state.isAuthenticated = true;
        setUserAndRole(state, action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCESS;
        state.isAuthenticated = true;
        setUserAndRole(state, action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = AuthStatus.SUCCESS;
        state.isAuthenticated = true;
        setUserAndRole(state, action.payload.user);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setActiveRole } = authSlice.actions;
export default authSlice.reducer; 