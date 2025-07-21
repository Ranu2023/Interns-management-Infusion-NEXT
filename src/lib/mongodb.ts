// @ts-nocheck
import { MongoClient, Db } from 'mongodb';
import 'dotenv/config';
import { initialData } from './seed-data';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'synergy';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// A mock in-memory database that mimics the MongoDB API
const getMockDb = () => {
  const mockDb = {
    collection: (name: keyof typeof initialData) => {
      const data = initialData[name] || [];
      return {
        find: (query = {}, options = {}) => {
            // This is a simplified find that doesn't handle complex queries
            return {
                limit: (num: number) => ({
                    toArray: async () => data.slice(0, num),
                }),
                project: () => ({ // Simplified projection
                    toArray: async () => data,
                }),
                toArray: async () => data,
            }
        },
        findOne: async (query: { id?: number, title?: string, mentor?: string }) => {
            if (query.id) {
                return data.find((item: any) => item.id === query.id) || null;
            }
            if (query.title) {
                 return data.find((item: any) => item.title === query.title) || null;
            }
            if (query.mentor) {
                return data.filter((item: any) => item.mentor === query.mentor) || [];
            }
            return data.length > 0 ? data[0] : null;
        },
        countDocuments: async (query = {}) => {
            // Simplified count for PPO status
            if (query.ppoStatus === 'Recommended') {
                return initialData.interns.filter(i => i.ppoStatus === 'Recommended').length;
            }
             if (query.status === 'In Progress') {
                return initialData.projects.filter(p => p.status === 'In Progress').length;
            }
            return data.length;
        },
        // Add other methods you use here and have them do nothing or return mock data
      };
    },
  };
  return mockDb as unknown as Db;
}


async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  if (!uri) {
    console.warn(`
      ****************************************************************
      *                                                              *
      *  ⚠️  MONGODB_URI environment variable is not set.           *
      *  Using mock data as a fallback. Add the URI to .env          *
      *  to connect to your database.                                *
      *                                                              *
      ****************************************************************
    `);
    // Return the mock DB if URI is not set
    return { client: null, db: getMockDb() };
  }

  const client = new MongoClient(uri!);

  try {
    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
     console.error("Failed to connect to MongoDB, falling back to mock data.", error);
     return { client: null, db: getMockDb() };
  }
}

export async function getDb() {
    const { db } = await connectToDatabase();
    return db;
}
