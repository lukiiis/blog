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
  
  const newPost: Post = {
    _id: new ObjectId(),
    authorId: postData.authorId,
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

export async function getPostsByCategory(category: string): Promise<PostDto[]> {
  try {
    const posts = await db.collection<Post>("Post").find({
      category: category
    }).toArray();

    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    throw error;
  }
}

export async function getPostsByYearAndMonth(year: number, month: number): Promise<PostDto[]> {
  try {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    const posts = await db.collection<Post>("Post").find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    }).toArray();

    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching posts by year and month:", error);
    throw error;
  }
}

// Fetch posts by multiple filters: year, month, category
export async function getFilteredPosts(
  year?: number,
  month?: number,
  category?: string
): Promise<PostDto[]> {
  try {
    const filters: any = {};

    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);
      filters.createdAt = { $gte: startOfYear, $lt: endOfYear };
    }

    if (month !== undefined && year !== undefined) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 1);
      filters.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
    }

    if (category) {
      filters.category = category;
    }

    const posts = await db.collection<Post>("Post").find(filters).toArray();
    return posts.map(mapPostToDto);
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    throw error;
  }
}