import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { login, clearError } from '../../store/slices/authSlice';
import { AuthStatus, type LoginCredentials } from '../../types/auth';
import type { RootState } from '../../store';
import { useEffect } from 'react';
import { loginSchema } from './validations';


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

  return (
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
  );
}; 