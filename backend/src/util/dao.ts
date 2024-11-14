// dao.ts
import { ObjectId } from 'mongodb';

export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
    isAdmin: boolean;
    isActive: boolean;
}

export interface Post {
    _id: ObjectId;
    authorId: ObjectId;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    _id: ObjectId;
    postId: ObjectId;
    authorId: ObjectId;
    content: string;
    createdAt: Date;
}

export interface Like {
    _id: ObjectId;
    postId: ObjectId;
    userId: ObjectId;
    createdAt: Date;
}
