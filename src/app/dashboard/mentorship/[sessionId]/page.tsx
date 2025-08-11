
'use server';

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/db";
import MentorshipSession from "@/lib/models/MentorshipSession";
import { notFound, redirect } from "next/navigation";
import Intern from "@/lib/models/Intern";
import Mentor from "@/lib/models/Mentor";
import { User } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

async function getSessionData(sessionId: string, userId: string, userRole: string) {
    await dbConnect();

    const session = await MentorshipSession.findById(sessionId)
        .populate({ path: 'intern', model: Intern, select: 'name email avatar' })
        .populate({ path: 'mentor', model: Mentor, select: 'name email avatar' })
        .lean();

    if (!session) {
        return null;
    }
    
    // Security check: ensure the logged-in user is part of this session
    const isParticipant = (userRole === 'intern' && session.intern._id.toString() === userId) || 
                          (userRole === 'mentor' && session.mentor._id.toString() === userId);

    if (!isParticipant) {
        return null;
    }

    return JSON.parse(JSON.stringify(session));
}


export default async function MentorshipSessionPage({ params }: { params: { sessionId: string }}) {
    const session = await getSession();
    if (!session?.user) {
        redirect('/');
    }
    const currentUser = session.user as User;

    const sessionData = await getSessionData(params.sessionId, currentUser.id, currentUser.role);

    if (!sessionData) {
        notFound();
    }
    
    const otherUser = currentUser.role === 'intern' ? sessionData.mentor : sessionData.intern;

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
            <Card className="flex-grow flex flex-col">
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                         <Avatar>
                            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                             <CardTitle>{otherUser.name}</CardTitle>
                             <CardDescription>{otherUser.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 space-y-4 overflow-y-auto">
                    {sessionData.chat.map((item: any, index: number) => (
                        <div key={index} className={`flex items-end gap-2 ${item.senderId.toString() === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            {item.senderId.toString() !== currentUser.id && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                             <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${item.senderId.toString() === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{item.message}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="pt-6 border-t">
                     <form className="flex w-full items-center gap-2">
                        <Textarea
                            placeholder="Type your message..."
                            className="flex-1"
                            rows={1}
                        />
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5"/>
                            <span className="sr-only">Attach file</span>
                        </Button>
                         <Button size="icon">
                            <Send className="h-5 w-5"/>
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
