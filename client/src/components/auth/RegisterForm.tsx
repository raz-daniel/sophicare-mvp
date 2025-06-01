import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { register as registerUser, clearError } from '../../store/slices/authSlice';
import { AuthStatus, type RegisterCredentials } from '../../types/auth';
import type { RootState } from '../../store';
import { useEffect } from 'react';

const schema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters'),
    email: z
        .string()
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status = AuthStatus.IDLE, error = null } = useAppSelector((state: RootState) => state.auth || {});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterCredentials>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data: RegisterCredentials) => {
        try {
            const result = await dispatch(registerUser(data)).unwrap();
            // Redirect to dashboard for new therapists
            navigate('/dashboard');
        } catch (error) {
            // Error is handled by the reducer
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