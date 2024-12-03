import React from 'react';

interface CommentProps {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

const Comment: React.FC<CommentProps> = ({ id, postId, authorId, content, createdAt }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <p className="text-gray-700 mb-2">{content}</p>
      <div className="text-gray-500 text-sm">
        <p><strong>Comment ID:</strong> {id}</p>
        <p><strong>Author ID:</strong> {authorId}</p>
        <p><strong>Post ID:</strong> {postId}</p>
        <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Comment;