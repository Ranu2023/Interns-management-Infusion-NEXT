
'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { User as AuthUser } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import User from '@/lib/models/User';
import Intern from '@/lib/models/Intern';
import Mentor from '@/lib/models/Mentor';
import dbConnect from '@/lib/db';

async function getChatUsers(currentUser: AuthUser): Promise<(AuthUser & {_id: string})[]> {
    await dbConnect();
    let chatUsers: any[] = [];
  
    if (currentUser.role === 'mentor') {
      // Mentor sees their assigned interns
      const interns = await Intern.find({ mentor: currentUser.name }).lean();
      if (interns.length > 0) {
        const internEmails = interns.map(i => i.email);
        chatUsers = await User.find({ email: { $in: internEmails } }, 'id name email avatar role').lean();
      }
    } else if (currentUser.role === 'intern') {
      // Intern sees their assigned mentor
      const internProfile = await Intern.findOne({ email: currentUser.email }).lean();
      if (internProfile && internProfile.mentor !== 'Unassigned') {
        const mentor = await Mentor.findOne({ name: internProfile.mentor }).lean();
        if (mentor) {
            const mentorUser = await User.findOne({ email: mentor.email }, 'id name email avatar role').lean();
            if(mentorUser) chatUsers.push(mentorUser);
        }
      }
    }
    return JSON.parse(JSON.stringify(chatUsers));
}

export default async function ChatPage() {
    const session = await getSession();
    if (!session?.user) {
        redirect('/');
    }

    const chatUsers = await getChatUsers(session.user);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chat</CardTitle>
                <CardDescription>Select a user to start a conversation.</CardDescription>
            </CardHeader>
            <CardContent>
                {chatUsers.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <MessageSquare className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No one to chat with</h3>
                        <p className="mt-2 text-sm">
                            {session.user.role === 'mentor' ? 'You have no assigned interns.' : 'You have not been assigned a mentor yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {chatUsers.map((user) => (
                            <Link key={user._id} href={`/dashboard/chat/${user._id}`}>
                                <div className={cn(
                                    "flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-accent",
                                )}>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
