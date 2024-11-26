import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Post } from '../../services/postService';
import { fetchPostById, fetchCommentsByPostId, fetchLikesByPostId } from './postDetailService';
import CommentComponent from '../../components/comment/Comment';
import { Comment } from '../../services/commentService';
import { Like } from '../../services/likeService';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [showLikesPopup, setShowLikesPopup] = useState(false);

    const { data: post, error: postError, isLoading: postLoading } = useQuery<Post>({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id!)
    });

    const { data: comments, error: commentsError, isLoading: commentsLoading } = useQuery<Comment[]>({
        queryKey: ['comments', id],
        queryFn: () => fetchCommentsByPostId(id!)
    });

    const { data: likes, error: likesError, isLoading: likesLoading } = useQuery<Like[]>({
        queryKey: ['likes', id],
        queryFn: () => fetchLikesByPostId(id!)
    });

    if (postLoading || commentsLoading || likesLoading) {
        return <div>Loading...</div>;
    }

    if (postError) {
        return <div>Error loading post</div>;
    }

    if (commentsError) {
        return <div>Error loading comments</div>;
    }

    if (likesError) {
        return <div>Error loading likes</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">{post?.title}</h2>
            <p className="text-gray-800 mb-4 break-words">{post?.content}</p>
            <p className="text-gray-800"><strong>Author ID:</strong> {post?.authorId}</p>
            <p className="text-gray-800"><strong>Category:</strong> {post?.category}</p>
            <p className="text-gray-800"><strong>Created At:</strong> {post?.createdAt.toLocaleString()}</p>
            <p className="text-gray-800"><strong>Updated At:</strong> {post?.updatedAt.toLocaleString()}</p>
    
            <h3 className="text-xl font-bold mt-6 mb-4 text-black">Comments</h3>
            {comments?.length ? (
                comments.map((comment) => (
                    <CommentComponent key={comment.id} {...comment} />
                ))
            ) : (
                <p className="text-gray-800">No comments available</p>
            )}
    
            {likes?.length ? (
                <p className="text-gray-800 cursor-pointer" onClick={() => setShowLikesPopup(true)}>
                    {likes?.length} {likes?.length === 1 ? 'Like' : 'Likes'}
                </p>
            ) : (
                <p className="text-gray-800">0 likes, be first to like!</p>
            )}
    
            {showLikesPopup && likes?.length && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                        <h3 className="text-xl font-bold mb-4 text-black">Likes</h3>
                        <button className="absolute top-2 right-2 text-gray-800" onClick={() => setShowLikesPopup(false)}>Close</button>
                        {likes.map((like) => (
                            <div key={like.id} className="mb-2 text-gray-800">
                                <p><strong>Like ID:</strong> {like.id}</p>
                                <p><strong>User ID:</strong> {like.userId}</p>
                                <p><strong>Post ID:</strong> {like.postId}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetail;