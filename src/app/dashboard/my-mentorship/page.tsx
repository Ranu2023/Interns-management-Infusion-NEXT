
'use server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import dbConnect from '@/lib/db';
import MentorshipRequest from '@/lib/models/MentorshipRequest';
import { getSession } from "@/lib/session";
import { User } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { type IMentorshipRequest } from "@/lib/models/MentorshipRequest";
import mongoose from "mongoose";


type PopulatedRequest = Omit<IMentorshipRequest, 'intern' | 'mentor'> & {
    _id: string;
    intern: User;
    mentor: User;
    createdAt: string;
}


async function getMyMentorships(internId: string): Promise<PopulatedRequest[]> {
    await dbConnect();
    const requests = await MentorshipRequest.find({ intern: new mongoose.Types.ObjectId(internId) })
        .populate<{mentor: User}>({ path: 'mentor', model: 'User', select: 'name email avatar expertise' })
        .sort({ createdAt: -1 })
        .lean();
    return JSON.parse(JSON.stringify(requests));
}


export default async function MyMentorshipPage() {
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user.role !== 'intern') redirect('/dashboard');
    
    const mentorships = await getMyMentorships(user.id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Premium Mentorships</CardTitle>
                <CardDescription>Track the status of your mentorship requests and connect with your mentors.</CardDescription>
            </CardHeader>
            <CardContent>
                {mentorships.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        You have not requested any mentorship sessions yet.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mentor</TableHead>
                                <TableHead>Expertise</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mentorships.map((req) => (
                                <TableRow key={req._id}>
                                    <TableCell>
                                        {req.mentor ? (
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={req.mentor.avatar} alt={req.mentor.name} data-ai-hint="avatar person" />
                                                    <AvatarFallback>{req.mentor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{req.mentor.name}</p>
                                                    <p className="text-sm text-muted-foreground">{req.mentor.email}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Mentor not found</p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {req.mentor?.expertise ? (
                                            <Badge variant="secondary">{req.mentor.expertise}</Badge>
                                        ) : (
                                            <Badge variant="outline">N/A</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            req.status === 'Accepted' ? 'default' :
                                            req.status === 'Rejected' ? 'destructive' : 'outline'
                                        }>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'Accepted' && (
                                            <Button asChild>
                                                <a href="https://zoom.us/j/1234567890" target="_blank" rel="noopener noreferrer">
                                                    <Video className="mr-2"/> Join Call
                                                </a>
                                            </Button>
                                        )}
                                        {req.status === 'Pending' && <span className="text-xs text-muted-foreground">Awaiting response</span>}
                                        {req.status === 'Rejected' && <span className="text-xs text-muted-foreground">Not accepted</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

    