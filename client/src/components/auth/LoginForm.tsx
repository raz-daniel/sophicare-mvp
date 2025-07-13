import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { login, clearError, googleLogin } from '../../store/slices/authSlice';
import { AuthStatus, type LoginCredentials } from '../../types/auth';
import type { RootState } from '../../store';
import { useEffect } from 'react';
import { loginSchema } from './validations';
import { GoogleLogin } from '@react-oauth/google';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status = AuthStatus.IDLE, error = null } = useAppSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }
  const handleGoogleError = () => {
    console.log('Google login failed')
  }

  return (

    <div className='space-y-6'>
      <div className='space-y-4'>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          />

        <div className='flex items-center'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-4 text-sm text-text/60'>OR</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input-field mt-1"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="error-text">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="input-field mt-1"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-fire/10 p-4">
            <p className="text-fire text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === AuthStatus.LOADING}
          className="btn-primary w-full"
        >
          {status === AuthStatus.LOADING ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}; 