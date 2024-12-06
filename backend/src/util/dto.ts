// dtos.ts
import { ObjectId } from 'mongodb';

export interface UserDto {
    id: ObjectId;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date,
    isAdmin: boolean;
    isBlocked: boolean;
    isActive: boolean;
}

export interface PostDto {
    id: ObjectId;
    authorId: ObjectId;
    username?: string;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface PostWithUsernameDto extends PostDto {
    username: string;
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
    username?: string;
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
    username?: string;
    postId: ObjectId;
    userId: ObjectId;
}

export interface LikeFullDto {
    id: ObjectId;
    postId: string;
    userId: string;
}

export type RegisterRequestDto = {
    username: string;
    email: string;
    password: string;
    bio?: string;
    profilePicture?: string;
}

export type RegisterResponseDto = {
    message: string;
    userId: ObjectId;
}

export type AuthRequestDto = {
    email: string;
    password: string;
}

export type AuthResponseDto = {
    token: string;
    message: string;
    userId: ObjectId;
    isAdmin: boolean;
}
