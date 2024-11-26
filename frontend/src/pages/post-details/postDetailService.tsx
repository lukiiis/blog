import axiosInstance from "../../config/axiosConfig";
import { Post } from "../../services/postService";
import { Comment } from "../../services/commentService";

export const fetchPostById = async (id: string): Promise<Post> => {
    const response = await axiosInstance.get(`/posts/id/${id}`);
    return response.data;
};

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/comments/post/${postId}`);
    return response.data;
  };