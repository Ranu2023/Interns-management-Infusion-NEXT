// @ts-nocheck
import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'synergy';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
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
    return db;
}
