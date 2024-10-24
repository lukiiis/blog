// dtos.ts

export type UserDto = {
    _id: string;
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

export type PostDto = {
    _id: string;
    authorId: string;
    title: string;
    content: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CommentDto = {
    _id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: Date;
};

export type LikeDto = {
    _id: string;
    postId: string;
    userId: string;
    createdAt: Date;
};
