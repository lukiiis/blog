import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const CONNECTION_URI: string = process.env.ATLAS_URI || "";
const DATABASE_NAME: string = "Blobiboks"

export let client: MongoClient;
export let db: Db;

export async function connectToDatabase() {
  try {
    client = new MongoClient(CONNECTION_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log("successfully connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    throw e;
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
