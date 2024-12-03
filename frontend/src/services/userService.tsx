import axiosInstance from '../config/axiosConfig';

export interface User {
    id: string;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchUserById = async (id: string): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`/user/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};