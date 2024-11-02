import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { Post } from "../util/dao";
import { PostDto } from "../util/dto";
import { mapPostToDto } from "../mappers/mappers";

export async function getAllPosts(): Promise<PostDto[]> {
  try {
    const posts = await db.collection<Post>("Post").find({}).toArray();
    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
}

export async function getPostsByAuthorId(authorId: ObjectId): Promise<PostDto[]> {
  try {
    if (!ObjectId.isValid(authorId)) {
      throw new Error("Invalid author ID format");
    }

    const posts = await db.collection<Post>("Post").find({ authorId: new ObjectId(authorId) }).toArray();

    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching posts by author ID:", error);
    throw error;
  }
}

export async function createPostService(postData: Omit<PostDto, 'id'>): Promise<PostDto> {
  try {
    console.log("Post data received:", postData);
    console.log("Author ID:", postData.authorId);

    if (!postData.authorId) {
      throw new Error("Author ID is required to create a post");
    }

    const newPost: Post = {
      _id: new ObjectId(), 
      authorId: new ObjectId(postData.authorId), 
      title: postData.title || "",
      content: postData.content || "",
      category: postData.category || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Post>("Post").insertOne(newPost);
    
    return mapPostToDto({ 
      ...newPost, 
      _id: result.insertedId 
    }); 
  } catch (error) {
    console.error("Error creating post:", error);
    throw error; 
  }
}

export async function updatePostService(postId: ObjectId, updateData: Partial<PostDto>): Promise<PostDto | null> {
  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID format");
    }

    const updateFields: Partial<Post> = { ...updateData, updatedAt: new Date() };

    if (updateFields.createdAt && typeof updateFields.createdAt === 'string') {
      updateFields.createdAt = new Date(updateFields.createdAt); 
    }

    const result = await db.collection<Post>("Post").findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    return result ? mapPostToDto(result) : null;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePostService(postId: ObjectId): Promise<boolean> {
  try {
    const result = await db.collection<Post>("Post").deleteOne({ _id: postId });
    return result.deletedCount === 1;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}