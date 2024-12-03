import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { Like, User } from "../util/dao";
import { LikeDto } from "../util/dto";
import { mapLikeToDto } from "../mappers/mappers";

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
        const likes = await db.collection<Like>("Like").find({ postId }).toArray();

        if (!likes || likes.length === 0) {
            return [];
        }

        const likeDtos: LikeDto[] = await Promise.all(
            likes.map(async (element) => {
                const user = await db.collection<User>("User").findOne({ _id: element.userId });
                const likeDTO = mapLikeToDto(element);
                likeDTO.username = user?.username || "Unknown";
                return likeDTO;
            })
        );

        return likeDtos;
    } catch (error) {
        console.error("Error fetching likes by post ID:", error);
        throw error;
    }
}

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

        return likeDTO;
    } catch (error) {
        console.error('Error fetching like by ID:', error);
        throw error;
    }
}
