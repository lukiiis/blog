import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { Like, User } from "../util/dao";
import { LikeDto } from "../util/dto";
import { mapLikeToDto } from "../mappers/mappers";

// Funkcja do dodawania polubienia
export async function createLikeService(likeData: Omit<LikeDto, 'id'>): Promise<LikeDto> {
    try {
        const newLike: Like = {
            _id: new ObjectId(),
            postId: new ObjectId(likeData.postId),
            userId: new ObjectId(likeData.userId),
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

export async function getLikesByPostId(postId: ObjectId): Promise<LikeDto[]> {
    try {
        // Pobieranie wszystkich polubień na podstawie postId
        const likes = await db.collection<Like>("Like").find({ postId }).toArray();

        if (!likes || likes.length === 0) {
            return []; // Zwróć pustą tablicę, jeśli brak polubień
        }

        // Mapowanie polubień na DTO z uwzględnieniem nazwy użytkownika
        const likeDtos: LikeDto[] = await Promise.all(
            likes.map(async (element) => {
                const user = await db.collection<User>("User").findOne({ _id: element.userId });
                const likeDTO = mapLikeToDto(element);
                likeDTO.username = user?.username || "Unknown"; // Ustaw "Unknown", jeśli użytkownik nie istnieje
                return likeDTO;
            })
        );

        return likeDtos; // Zwróć tablicę DTO
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

export async function getLikeById(likeId: ObjectId): Promise<LikeDto | null> {
    try {
        if (!ObjectId.isValid(likeId)) {
            throw new Error('Invalid like ID format');
        }

        const like = await db.collection<Like>('Like').findOne({ _id: likeId });
        const user = await db.collection<User>("User").findOne({ _id: like?.userId });

        if (!like) {
            return null;
        }

        const likeDTO = mapLikeToDto(like)
        likeDTO.username = user?.username;

        return likeDTO; // Convert to DTO format if necessary
    } catch (error) {
        console.error('Error fetching like by ID:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
