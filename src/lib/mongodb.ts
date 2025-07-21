// @ts-nocheck
import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'synergy';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  if (!uri) {
    console.warn(`
      ****************************************************************
      *                                                              *
      *  ⚠️  MONGODB_URI environment variable is not set.           *
      *  Please add it to the .env file to connect to the database.  *
      *  The app will proceed with empty data.                       *
      *                                                              *
      ****************************************************************
    `);
    return { client: null, db: null };
  }

  const client = new MongoClient(uri!);

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDb() {
    const { db } = await connectToDatabase();
    // If the connection failed, we return a mock db object
    // that returns empty arrays for collections to prevent crashes.
    if (!db) {
        return {
            collection: () => ({
                find: () => ({
                    toArray: async () => [],
                }),
                findOne: async () => null,
                // Add other methods you use here and have them do nothing
            }),
        } as unknown as Db;
    }
    return db;
}
