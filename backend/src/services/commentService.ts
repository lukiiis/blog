import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { Comment, User } from "../util/dao";
import { CommentDto } from "../util/dto"; 
import { mapCommentToDto } from "../mappers/mappers"; 


// export async function getAllComments(): Promise<CommentDto[]> {
//     try {
//       const comments = await db.collection<Comment>("Comment").find({}).toArray();
//       return comments.map(mapCommentToDto);
//     } catch (error) {
//       console.error("Error fetching all comments:", error);
//       throw error;
//     }
//   }

export async function getCommentsByAuthorId(authorId: ObjectId): Promise<CommentDto[]> {
  try {
    if (!ObjectId.isValid(authorId)) {
      throw new Error("Invalid author ID format");
    }

    const comments = await db.collection<Comment>("Comment").find({ authorId: authorId }).toArray();
    return comments.map(mapCommentToDto);
  } catch (error) {
    console.error("Error fetching comments by author ID:", error);
    throw error;
  }
}

export async function getCommentsByPostId(postId: ObjectId): Promise<CommentDto[]> {
  try {
      if (!ObjectId.isValid(postId)) {
          throw new Error("Invalid post ID format");
      }

      // Pobierz komentarze z bazy danych
      const comments = await db.collection<Comment>("Comment").find({ postId }).toArray();

      // Mapuj komentarze na DTO z dodatkową informacją o autorze
      const commentDtos: CommentDto[] = await Promise.all(
          comments.map(async (comment) => {
              const user = await db.collection<User>("User").findOne({ _id: comment.authorId });
              const commentDto = mapCommentToDto(comment);
              commentDto.username = user?.username || "Unknown"; // Ustaw "Unknown", jeśli użytkownik nie istnieje
              return commentDto;
          })
      );

      return commentDtos;
  } catch (error) {
      console.error("Error fetching comments by post ID:", error);
      throw error;
  }
}

export async function getCommentById(commentId: ObjectId): Promise<CommentDto | null> {
  try {
    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID format");
    }

    const comment = await db.collection<Comment>("Comment").findOne({ _id: commentId });
    return comment ? mapCommentToDto(comment) : null;
  } catch (error) {
    console.error("Error fetching comment by ID:", error);
    throw error;
  }
}

export async function createCommentService(commentData: Omit<CommentDto, 'id'>): Promise<CommentDto> {
  try {
    if (!commentData.authorId || !commentData.postId) {
      throw new Error("Author ID and Post ID are required to create a comment");
    }

    const newComment: Comment = {
      _id: new ObjectId(),
      authorId: new ObjectId(commentData.authorId),
      postId: new ObjectId(commentData.postId),
      content: commentData.content || "",
      createdAt: new Date(),
    };

    const result = await db.collection<Comment>("Comment").insertOne(newComment);
    return mapCommentToDto({ ...newComment, _id: result.insertedId }); 
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error; 
  }
}

export async function updateCommentService(commentId: ObjectId, updateData: Partial<CommentDto>): Promise<CommentDto | null> {
  try {
    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID format");
    }

    const updateFields: Partial<Comment> = { ...updateData };

    const result = await db.collection<Comment>("Comment").findOneAndUpdate(
      { _id: commentId },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    return result ? mapCommentToDto(result) : null;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}


export async function deleteCommentService(commentId: ObjectId): Promise<boolean> {
  try {
    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID format");
    }

    const result = await db.collection<Comment>("Comment").deleteOne({ _id: commentId });
    return result.deletedCount === 1;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
