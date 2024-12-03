import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Post } from '../../services/postService';
import { fetchPostById, fetchCommentsByPostId, fetchLikesByPostId, addLike, removeLike, addComment, deleteComment } from '../post-details/postDetailService';
import { Comment } from '../../services/commentService';
import { Like } from '../../services/likeService';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [showLikesPopup, setShowLikesPopup] = useState(false);
    const [newComment, setNewComment] = useState<string>('');
    const userId = localStorage.getItem('userId');

    const { data: post, error: postError, isLoading: postLoading } = useQuery<Post>({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id!),
    });

    const { data: comments = [], error: commentsError, isLoading: commentsLoading, refetch: refetchComments } = useQuery<Comment[]>({
        queryKey: ['comments', id],
        queryFn: () => fetchCommentsByPostId(id!),
    });

    const { data: likes = [], error: likesError, isLoading: likesLoading, refetch: refetchLikes } = useQuery<Like[]>({
        queryKey: ['likes', id],
        queryFn: () => fetchLikesByPostId(id!),
    });

    const { mutate: addLikeMutation } = useMutation({
        mutationFn: (data: { postId: string; userId: string }) => addLike(data.postId, data.userId),
        onSuccess: () => refetchLikes(),
    });

    const { mutate: removeLikeMutation } = useMutation({
        mutationFn: (likeId: string) => removeLike(likeId),
        onSuccess: () => refetchLikes(),
    });

    const { mutate: addCommentMutation } = useMutation({
        mutationFn: (data: { postId: string; authorId: string; content: string }) => addComment(data.postId, data.authorId, data.content),
        onSuccess: () => {
            refetchComments();
            setNewComment('');
        },
    });

    const { mutate: deleteCommentMutation } = useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => refetchComments(),
    });

    const handleLike = () => {
        if (!userId) {
            alert('Please login to like this post');
            return;
        }
        if (id) {
            addLikeMutation({ postId: id, userId });
        }
    };

    const handleUnlike = (likeId: string) => {
        if (!userId) {
            alert('Please login to unlike this post');
            return;
        }
        removeLikeMutation(likeId);
    };

    const handleAddComment = () => {
        if (!userId) {
            alert('Please log in to add a comment');
            return;
        }
        if (id && newComment.trim()) {
            addCommentMutation({ postId: id, authorId: userId, content: newComment });
        }
    };

    const handleDeleteComment = (commentId: string) => {
        if (!userId) {
            alert('Please log in to delete a comment');
            return;
        }
        deleteCommentMutation(commentId);
    };

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

    const userLike = likes.find(like => like.userId === userId);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto max-w-2xl text-black">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">{post?.title}</h2>
            <p className="text-gray-800 mb-4 break-words">{post?.content}</p>
            <p className="text-gray-800"><strong>Author:</strong> {post?.username}</p>
            <p className="text-gray-800"><strong>Category:</strong> {post?.category}</p>
            <p className="text-gray-800"><strong>Created At:</strong> {post?.createdAt.toLocaleString()}</p>
            <p className="text-gray-800"><strong>Updated At:</strong> {post?.updatedAt.toLocaleString()}</p>

            <h3 className="text-xl font-bold mt-6 mb-4 text-black">Comments</h3>
            {comments.length ? (
                comments.map((comment) => (
                    <div key={comment.id.toString()} className="mb-4 p-4 bg-gray-100 rounded-lg">
                        <p className="text-gray-600 text-sm"><strong>Author:</strong> {comment.username}</p>
                        <p className="text-gray-800 break-words">{comment.content}</p>
                        {/* Sprawdź czy użytkownik jest zalogowany i czy to autor komentarza */}
                        {userId && comment.authorId === userId && (
                            <button
                                onClick={() => handleDeleteComment(comment.id.toString())}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-800">No comments available</p>
            )}

            <div className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Write a comment..."
                />
                <button
                    onClick={handleAddComment}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                    Add Comment
                </button>
            </div>

            <div className="flex items-center justify-between mt-4">
                {/* Sprawdź, czy użytkownik jest zalogowany */}
                {userId && userLike ? (
                    <button
                        onClick={() => handleUnlike(userLike.id.toString())}
                        className="text-red-500 hover:text-red-700"
                    >
                        Unlike
                    </button>
                ) : (
                    userId && (
                        <button
                            onClick={handleLike}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Like
                        </button>
                    )
                )}
                <p className="text-gray-800 cursor-pointer" onClick={() => setShowLikesPopup(true)}>
                    {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
                </p>
            </div>

            {showLikesPopup && likes.length && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                        <h3 className="text-xl font-bold mb-4 text-black">Likes</h3>
                        <button className="absolute top-2 right-2 text-gray-800" onClick={() => setShowLikesPopup(false)}>Close</button>
                        {likes.map((like) => (
                            <div key={like.id.toString()} className="mb-2 text-gray-800">
                                <p><strong>User:</strong> {like.username}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetail;
