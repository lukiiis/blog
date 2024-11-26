import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../config/axiosConfig';
import { AxiosError } from 'axios';

interface LoginFormInputs {
    email: string;
    password: string;
}

interface LoginSuccessResponse {
    token: string;
    message: string;
    userId: string;
    isAdmin: boolean;
}

const login = async (data: LoginFormInputs) => {
    const response = await axiosInstance.post('/auth', data);
    return response.data;
};

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data: LoginSuccessResponse) => {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('isAdmin', data.isAdmin.toString());
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.error('Login failed:', error.response?.data?.message || error.message);
        },
    });

    const onSubmit = (data: LoginFormInputs) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-4"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Logging in...' : 'Login'}
                </button>
                {mutation.isError && <p className="text-red-500 text-sm mt-4">{mutation.error.response?.data?.message || mutation.error.message}</p>}
            </form>
        </div>
    );
};

export default Login;