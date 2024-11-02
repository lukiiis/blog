import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { User } from "../util/dao";
import { UserDto } from "../util/dto";
import { mapUserToDto } from "../mappers/mappers";

export async function getAllUsers(): Promise<UserDto[]> {
  try {
    const users = await db.collection<User>("User").find({}).toArray();
    return users.map(mapUserToDto);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getUserById(userId: ObjectId): Promise<UserDto | null> {
  try {
    const user = await db.collection<User>("User").findOne({ _id: userId });
    return user ? mapUserToDto(user) : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

