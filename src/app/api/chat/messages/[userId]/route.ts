
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import Message from '@/lib/models/Message';
import { Types } from 'mongoose';
import { User as AuthUser } from '@/context/AuthContext';


export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const session = await getSession();
  const currentUser = session?.user as AuthUser;
  const otherUserId = params.userId;

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Types.ObjectId.isValid(otherUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    await dbConnect();
    
    const messages = await Message.find({
      $or: [
        { senderId: currentUser.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUser.id },
      ],
    }).sort({ timestamp: 1 }).lean();

    return NextResponse.json(JSON.parse(JSON.stringify(messages)));
  } catch (error) {
    console.error('Failed to fetch messages', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
