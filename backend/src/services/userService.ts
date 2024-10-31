import { ObjectId } from "mongodb";
import { db } from "../db/connection";
import { User } from "../util/dao";

export async function getAllUsers(): Promise<User[]> {
  try {
    return await db.collection<User>("User").find({}).toArray();
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    return await db.collection<User>("User").findOne({_id: new ObjectId(userId)});
  }
  catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

