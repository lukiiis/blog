import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../config/axiosConfig';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
    bio?: string;
    profilePicture?: string;
}

interface RegisterSuccessResponse {
    message: string;
    userId: string;
}

const registerUser = async (data: RegisterFormInputs) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
};

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data: RegisterSuccessResponse) => {
            console.log('Registration successful:', data);
            setSuccessMessage(data.message);
            setShowSuccessPopup(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        },
        onError: (error: AxiosError<{message: string}>) => {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            setErrorMessage(error.response?.data?.message || error.message);
            setShowErrorPopup(true);
        },
    });

    const onSubmit = (data: RegisterFormInputs) => {
        mutation.mutate(data);
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 64px - 64px)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-black text-2xl font-bold mb-4 text-center">Register</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username</label>
                    <input
                        id="username"
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>
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
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-gray-700">Bio</label>
                    <textarea
                        id="bio"
                        {...register('bio')}
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-gray-700">Profile Picture URL</label>
                    <input
                        id="profilePicture"
                        type="text"
                        {...register('profilePicture')}
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-4"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Registering...' : 'Register'}
                </button>
                {mutation.isError && <p className="text-red-500 text-sm mt-4">{mutation.error.response?.data?.message || mutation.error.message}</p>}
            </form>

            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                        <h3 className="text-xl font-bold mb-4 text-black">Registration Successful</h3>
                        <p className="text-gray-800 mb-4">{successMessage}</p>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded" onClick={() => setShowSuccessPopup(false)}>Close</button>
                    </div>
                </div>
            )}

            {showErrorPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                        <h3 className="text-xl font-bold mb-4 text-black">Registration Failed</h3>
                        <p className="text-gray-800 mb-4">{errorMessage}</p>
                        <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={() => setShowErrorPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;