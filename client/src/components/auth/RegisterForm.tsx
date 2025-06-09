import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { register as registerUser, clearError } from '../../store/slices/authSlice';
import { AuthStatus, type RegisterCredentials } from '../../types/auth';
import type { RootState } from '../../store';
import { useEffect } from 'react';
import { registerSchema } from './validations';


export const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status = AuthStatus.IDLE, error = null } = useAppSelector((state: RootState) => state.auth);

    const { register, handleSubmit, formState: { errors }, } = useForm<RegisterCredentials>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data: RegisterCredentials) => {
        try {
            await dispatch(registerUser(data)).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-text">
                    First Name
                </label>
                <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    className="input-field mt-1"
                    placeholder="Enter your first name"
                />
                {errors.firstName && (
                    <p className="error-text">{errors.firstName.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text">
                    Last Name
                </label>
                <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    className="input-field mt-1"
                    placeholder="Enter your last name"
                />
                {errors.lastName && (
                    <p className="error-text">{errors.lastName.message}</p>
                )}
            </div>

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
                {status === AuthStatus.LOADING ? 'Creating account...' : 'Create account'}
            </button>
        </form>
    );
}; 