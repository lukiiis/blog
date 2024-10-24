// dtos.ts

export interface UserDto {
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
}

export interface PostDto {
    _id: string;
    authorId: UserDto;
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
    _id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: Date;
}

export interface CommentFullDto {
    _id: string;
    postId: PostDto;
    authorId: UserDto;
    content: string;
    createdAt: Date;
}

export interface LikeDto {
    _id: string;
    postId: string;
    userId: string;
    createdAt: Date;
}

export interface LikeFullDto {
    _id: string;
    postId: PostDto;
    userId: UserDto;
    createdAt: Date;
}
