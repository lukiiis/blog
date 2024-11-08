import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { Like } from "../util/dao";
import { LikeDto } from "../util/dto";
import { mapLikeToDto } from "../mappers/mappers";

// Funkcja do dodawania polubienia
export async function createLikeService(likeData: Omit<LikeDto, 'id'>): Promise<LikeDto> {
    try {
        const newLike: Like = {
            _id: new ObjectId(),
            postId: likeData.postId,
            userId: likeData.userId,
            createdAt: new Date(),
        };

        const result = await db.collection<Like>("Like").insertOne(newLike);
        
        return mapLikeToDto({
            ...newLike,
            _id: result.insertedId,
        });
    } catch (error) {
        console.error("Error creating like:", error);
        throw error;
    }
}

// Funkcja do usuwania polubienia
export async function deleteLikeService(likeId: ObjectId): Promise<boolean> {
    try {
        const result = await db.collection<Like>("Like").deleteOne({ _id: likeId });
        return result.deletedCount === 1;
    } catch (error) {
        console.error("Error deleting like:", error);
        throw error;
    }
}

// Funkcja do pobierania polubień na podstawie postId
export async function getLikesByPostId(postId: ObjectId): Promise<LikeDto[]> {
    try {
        const likes = await db.collection<Like>("Like").find({ postId }).toArray();
        return likes.map(mapLikeToDto);
    } catch (error) {
        console.error("Error fetching likes by post ID:", error);
        throw error;
    }
}

// Funkcja do pobierania polubień na podstawie userId
export async function getLikesByUserId(userId: ObjectId): Promise<LikeDto[]> {
    try {
        const likes = await db.collection<Like>("Like").find({ userId: userId }).toArray();
        return likes.map(mapLikeToDto);
    } catch (error) {
        console.error("Error fetching likes by user ID:", error);
        throw error;
    }
}
