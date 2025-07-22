import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Application from '@/lib/models/Application';
import { initialData } from '@/lib/seed-data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    await dbConnect();

    // To handle both seeding and regular requests, we'll use a local function.
    // In a real app, this API might not be needed if using server components correctly.
    const getApp = async () => {
        let app = await Application.findById(id).lean();
        return app;
    }
    
    const application = await getApp();

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({...application, _id: application._id.toString() });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
