// dtos.ts
import { ObjectId } from 'mongodb';

export interface UserDto {
    id: ObjectId;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    isAdmin: boolean;
    isActive: boolean;
}

export interface PostDto {
    id: ObjectId;
    authorId: ObjectId;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostWithCommentsDto extends PostDto {
    comments: CommentDto[];
}

export interface PostWithLikes extends PostDto {
    likes: LikeDto[];
}

export interface PostFullDto extends PostDto {
    comments: CommentDto[];
    likes: LikeDto[];
}

export interface CommentDto {
    id: ObjectId;
    postId: ObjectId;
    authorId: ObjectId;
    content: string;
    createdAt: Date;
}

export interface CommentFullDto {
    id: string;
    post: PostDto;
    author: UserDto;
    content: string;
    createdAt: Date;
}

export interface LikeDto {
    id: ObjectId;
    postId: ObjectId;
    userId: ObjectId;
}

export interface LikeFullDto {
    id: ObjectId;
    postId: string;
    userId: string;
}
