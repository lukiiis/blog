import { MongoClient, Db } from "mongodb";
import "../loadEnvironment";

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let db: Db | null = null;
//to się przeniesię gdzies 
let databaseName = 'blobiboks';

export async function connectToDatabase(): Promise<Db> {
  if (!db) {
    try {
      // Nawiązanie połączenia
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db(databaseName);
    } catch (e) {
      console.error('Failed to connect to MongoDB', e);
      throw e; // Wyjątek, jeśli nie uda się połączyć
    }
  }

  return db; // Zwracamy istniejące połączenie (singleton)
}