
'use server';

import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { User as AuthUser } from '@/context/AuthContext';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Message from '@/lib/models/Message';
import { ChatClient } from './ChatClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Types } from 'mongoose';

// Helper to ensure data passed to client components is plain
const toPlainObject = (obj: any) => JSON.parse(JSON.stringify(obj));

async function getChatPageData(currentUserId: string, otherUserId: string) {
    if (!Types.ObjectId.isValid(otherUserId) || !Types.ObjectId.isValid(currentUserId)) {
      return { otherUser: null, initialMessages: [] };
    }
  
    await dbConnect();
  
    const otherUser = await User.findById(otherUserId, 'name avatar').lean();
    if (!otherUser) {
      return { otherUser: null, initialMessages: [] };
    }
  
    const messages = await Message.find({
      $or: [
        { senderId: new Types.ObjectId(currentUserId), receiverId: new Types.ObjectId(otherUserId) },
        { senderId: new Types.ObjectId(otherUserId), receiverId: new Types.ObjectId(currentUserId) },
      ],
    })
      .sort({ timestamp: 1 })
      .limit(50)
      .lean();
  
    // Serialize data before returning
    return { 
        otherUser: toPlainObject(otherUser), 
        initialMessages: toPlainObject(messages) 
    };
}
  

export default async function ChatSessionPage(
    { params }: { params: { userId: string } }
  ) {
    const { userId } = params;
  
    const session = await getSession();
    if (!session?.user) {
      redirect('/');
    }
  
    const currentUser = session.user as AuthUser;
    const { otherUser, initialMessages } = await getChatPageData(
      currentUser.id,
      userId
    );
  
    if (!otherUser) {
      notFound();
    }
  
    return (
      <Card className="h-full flex flex-col max-h-[calc(100vh-8rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{otherUser.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <ChatClient
            otherUser={otherUser}
            initialMessages={initialMessages}
          />
        </CardContent>
      </Card>
    );
  }
  
