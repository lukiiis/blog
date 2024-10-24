// dao.ts
import { ObjectId } from 'mongodb';

export type UserDao = {
    _id: ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
    isAdmin: boolean;
    isActive: boolean;
};

export type PostDao = {
    _id: ObjectId;
    authorId: ObjectId; // Reference to User (_id)
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CommentDao = {
    _id: ObjectId;
    postId: ObjectId; // Reference to Post (_id)
    authorId: ObjectId; // Reference to User (_id)
    content: string;
    createdAt: Date;
};

export type LikeDao = {
    _id: ObjectId;
    postId: ObjectId; // Reference to Post (_id)
    userId: ObjectId; // Reference to User (_id)
    createdAt: Date;
};
