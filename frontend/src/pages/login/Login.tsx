import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../config/axiosConfig';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
    console.log(data)
    const response = await axiosInstance.post('/auth', data);
    return response.data;
};

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data: LoginSuccessResponse) => {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('isAdmin', data.isAdmin.toString());
            setSuccessMessage(data.message);
            setShowSuccessPopup(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.error('Login failed:', error.response?.data?.message || error.message);
            setErrorMessage(error.response?.data?.message || error.message);
            setShowErrorPopup(true);
        },
    });

    const onSubmit = (data: LoginFormInputs) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex items-center justify-center bg-gray-100" style={{ height: 'calc(100vh - 64px - 64px)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-black text-2xl font-bold mb-4 text-center">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
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

            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                        <h3 className="text-xl font-bold mb-4 text-black">Login Successful</h3>
                        <p className="text-gray-800 mb-4">{successMessage}</p>
                        <Link to="/" className="bg-blue-600 text-white py-2 px-4 rounded">Go to Home</Link>
                    </div>
                </div>
            )}

            {showErrorPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                        <h3 className="text-xl font-bold mb-4 text-black">Login Failed</h3>
                        <p className="text-gray-800 mb-4">{errorMessage}</p>
                        <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={() => setShowErrorPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;