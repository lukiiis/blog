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

export async function getPostByTitle(title: string): Promise<PostDto | null> {
  try {
    const post = await db.collection<Post>("Post").findOne({ title });
    return post ? mapPostToDto(post) : null;
  } catch (error) {
    console.error("Error fetching post by title:", error);
    throw error;
  }
}

export async function getPostsByAuthorId(authorId: ObjectId): Promise<PostDto[]> {
  try {
    if (!ObjectId.isValid(authorId)) {
      throw new Error("Invalid author ID format");
    }

    const posts = await db.collection<Post>("Post").find({ authorId: authorId }).toArray();

    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching posts by author ID:", error);
    throw error;
  }
}

export async function getPostById(postId: ObjectId): Promise<PostDto | null> {
  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID format");
    }

    const post = await db.collection<Post>("Post").findOne({ _id: postId });

    if (!post) {
      return null; // Return null if post not found
    }

    return mapPostToDto(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}

export async function createPost(postData: Omit<PostDto, 'id'>): Promise<PostDto> {
  if (!postData.authorId) {
    throw new Error("Author ID is required to create a post");
  }
  console.log("Post data received:", postData);
  console.log("Author ID:", postData.authorId);
  
  let authorObjectId;
  try {
    authorObjectId = new ObjectId(postData.authorId);
  } catch (error) {
    throw new Error("Invalid Author ID format");
  }

  const newPost: Post = {
    _id: new ObjectId(),
    authorId: authorObjectId,
    title: postData.title || "",
    content: postData.content || "",
    category: postData.category || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
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

export async function updatePost(postId: ObjectId, updateData: Partial<PostDto>): Promise<PostDto | null> {
  if (!ObjectId.isValid(postId)) {
    throw new Error("Invalid post ID format");
  }
  try {
    const updateFields: Partial<Post> = { ...updateData, updatedAt: new Date() };
    updateFields.authorId = new ObjectId(updateFields.authorId);

    const result = await db.collection<Post>("Post").findOneAndUpdate(
      { _id: postId },
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

export async function getPostsFromCurrentYear(): Promise<PostDto[]> {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear + 1, 0, 1);

  try {
    const posts = await db.collection<Post>("Post").find({
      createdAt: { $gte: startOfYear, $lt: endOfYear }
    }).toArray();

    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching posts from the current year:", error);
    throw error;
  }
}

// Fetch posts from the current month
export async function getPostsFromCurrentMonth(): Promise<PostDto[]> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const posts = await db.collection<Post>("Post").find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    }).toArray();

    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching posts from the current month:", error);
    throw error;
  }
}

export async function getFilteredPosts(
  year?: number,
  month?: number,
  category?: string
): Promise<PostDto[]> {
  const filter: any = {};
  // console.log(year, month, category);
  
  if (month && (month < 0 || month > 11)) {
    throw new Error("Invalid month value. Month must be between 0 (January) and 11 (December).");
  }
  
  if (year && month) {
    const start = new Date(year, month ?? 0, 1);
    const end = month
      ? new Date(year, month + 1, 1)
      : new Date(year + 1, 0, 1);
    filter.createdAt = { $gte: start, $lt: end };
  }
  
  if (category) {
    filter.category = category;
  }
  
  try {
    const posts = await db.collection<Post>("Post").find(filter).toArray();
    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    throw error;
  }
}
