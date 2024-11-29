import axiosInstance from '../config/axiosConfig';

export interface Post {
    id: string;
    authorId: string;
    username?: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchPosts = async (): Promise<Post[]> => {
    const response = await axiosInstance.get('/posts');
    return response.data;
};

export const fetchPostsByAuthorId = async (authorId: string): Promise<Post[]> => {
    const response = await axiosInstance.get(`/posts/author-id/${authorId}`);
    return response.data;
};