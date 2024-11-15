import { User, Post, Comment, Like } from "../util/dao";
import { UserDto, PostDto, CommentDto, LikeDto } from "../util/dto";

export function mapUserToDto(user: User): UserDto {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isAdmin: user.isAdmin,
    isActive: user.isActive
  };
}

export function mapPostToDto(post: Post): PostDto {
  return {
    id: post._id,
    authorId: post.authorId,
    title: post.title,
    content: post.content,
    category: post.category,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export function mapCommentToDto(comment: Comment): CommentDto {
  return {
    id: comment._id,
    postId: comment.postId,
    authorId: comment.authorId,
    content: comment.content,
    createdAt: comment.createdAt,
  };
}

export function mapLikeToDto(like: Like): LikeDto {
  return {
    id: like._id,
    postId: like.postId,
    userId: like.userId,
  };
}
