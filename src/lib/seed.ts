import { getDb } from './mongodb';
import { initialData } from './seed-data';
import 'dotenv/config';

async function seedDatabase() {
  try {
    const db = await getDb();
    console.log('Connected to database.');

    for (const [collectionName, data] of Object.entries(initialData)) {
        const collection = db.collection(collectionName);
        
        // Clear existing data
        await collection.deleteMany({});
        console.log(`Cleared collection: ${collectionName}`);

        // Insert new data
        if (data.length > 0) {
            await collection.insertMany(data);
            console.log(`Seeded ${data.length} documents into ${collectionName}`);
        }
    }

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
