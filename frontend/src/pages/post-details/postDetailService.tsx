import axiosInstance from "../../config/axiosConfig";
import { Post } from "../../services/postService";
import { Comment } from "../../services/commentService";
import { Like } from "../../services/likeService";

export const fetchPostById = async (id: string): Promise<Post> => {
    const response = await axiosInstance.get(`/posts/id/${id}`);
    return response.data;
};

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/comments/post/${postId}`);
    return response.data;
};

export const fetchLikesByPostId = async (postId: string): Promise<Like[]> => {
    const response = await axiosInstance.get(`/likes/post/${postId}`);
    return response.data;
};

export const addLike = async (postId: string, userId: string) => {
    const response = await axiosInstance.post('/likes', { postId, userId });
    return response.data;
};

export const removeLike = async (likeId: string) => {
    const response = await axiosInstance.delete(`/likes/${likeId}`);
    return response.data;
};

export const addComment = async (postId: string, authorId: string, content: string) => {
    const response = await axiosInstance.post('/comments', { postId, authorId, content });
    return response.data;
};

export const deleteComment = async (commentId: string) => {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data;
};