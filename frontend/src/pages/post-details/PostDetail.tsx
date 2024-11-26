import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Post } from '../../services/postService';
import { fetchPostById, fetchCommentsByPostId } from './postDetailService';
import CommentComponent from '../../components/comment/Comment';
import { Comment } from '../../services/commentService';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, error: postError, isLoading: postLoading } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id!)
  });

  const { data: comments, error: commentsError, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ['comments', id],
    queryFn: () => fetchCommentsByPostId(id!)
  });

  if (postLoading || commentsLoading) {
    return <div>Loading...</div>;
  }

  if (postError) {
    return <div>Error loading post</div>;
  }

  if (commentsError) {
    return <div>Error loading comments</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">{post?.title}</h2>
      <p className="text-gray-700 mb-4">{post?.content}</p>
      <p className="text-gray-500"><strong>Author ID:</strong> {post?.authorId}</p>
      <p className="text-gray-500"><strong>Category:</strong> {post?.category}</p>
      <p className="text-gray-500"><strong>Created At:</strong> {post?.createdAt.toLocaleString()}</p>
      <p className="text-gray-500"><strong>Updated At:</strong> {post?.updatedAt.toLocaleString()}</p>

      <h3 className="text-xl font-bold mt-6 mb-4 text-black">Comments</h3>
      {comments?.length ? (
        comments.map((comment) => (
          <CommentComponent key={comment.id} {...comment} />
        ))
      ) : (
        <p className="text-gray-500">No comments</p>
      )}
    </div>
  );
};

export default PostDetail;