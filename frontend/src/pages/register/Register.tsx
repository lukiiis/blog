import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../config/axiosConfig';

interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
    bio?: string;
    profilePicture?: string;
}

const registerUser = async (data: RegisterFormInputs) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
};

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data: { message: string; userId: string }) => {
            console.log('Registration successful:', data);
            // Handle successful registration (e.g., redirect to login page)
        },
        onError: (error: { response?: { data?: { message: string } }; message: string }) => {
            console.error('Registration failed:', error.response?.data?.message || error.message);
        },
    });

    const onSubmit = (data: RegisterFormInputs) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username</label>
                    <input
                        id="username"
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>
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
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-gray-700">Bio</label>
                    <textarea
                        id="bio"
                        {...register('bio')}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-gray-700">Profile Picture URL</label>
                    <input
                        id="profilePicture"
                        type="text"
                        {...register('profilePicture')}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
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
        </div>
    );
};

export default Register;