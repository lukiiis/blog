import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../config/axiosConfig';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface CreatePostFormInputs {
    title: string;
    content: string;
    category: string;
}

const createPost = async (data: CreatePostFormInputs) => {
    const token = localStorage.getItem('token');
    const authorId = localStorage.getItem('userId');

    if (!token || !authorId) {
        throw new Error('You must be logged in to create a post.');
    }

    const response = await axiosInstance.post('/posts', {
        ...data,
        authorId
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data;
};

const CreatePost: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreatePostFormInputs>();
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            setSuccessMessage('Post created successfully!');
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                navigate('/');
            }, 2000);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            setErrorMessage(error.response?.data?.message || error.message);
            setShowErrorPopup(true);
        },
    });

    const onSubmit = (data: CreatePostFormInputs) => {
        mutation.mutate(data);
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center overflow-auto" style={{ height: 'calc(100vh - 64px - 64px)' }}>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md min-w-[700px]">
                <h1 className="text-2xl font-bold mb-4 text-center text-black">Create Post</h1>
                {showErrorPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                            <h3 className="text-xl font-bold mb-4 text-black">Error</h3>
                            <p className="text-gray-800 mb-4">{errorMessage}</p>
                            <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={() => setShowErrorPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
                {showSuccessPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                            <h3 className="text-xl font-bold mb-4 text-black">Success</h3>
                            <p className="text-gray-800 mb-4">{successMessage}</p>
                            <button className="bg-blue-600 text-white py-2 px-4 rounded" onClick={() => setShowSuccessPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="title" className="text-black">Title</label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', { required: 'Title is required' })}
                            className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="content" className="text-black">Content</label>
                        <textarea
                            id="content"
                            {...register('content', { required: 'Content is required' })}
                            className="w-full p-2 border border-gray-300 rounded mt-1 text-black h-[20vh]"
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="text-black">Category</label>
                        <input
                            type="text"
                            id="category"
                            {...register('category', { required: 'Category is required' })}
                            className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded mt-4"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Creating...' : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;