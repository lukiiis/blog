// dao.ts
import { ObjectId } from 'mongodb';

export interface UserDao {
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
}

export interface PostDao {
    _id: ObjectId;
    authorId: ObjectId;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentDao {
    _id: ObjectId;
    postId: ObjectId;
    authorId: ObjectId;
    content: string;
    createdAt: Date;
}

export interface LikeDao {
    _id: ObjectId;
    postId: ObjectId;
    userId: ObjectId;
    createdAt: Date;
}
