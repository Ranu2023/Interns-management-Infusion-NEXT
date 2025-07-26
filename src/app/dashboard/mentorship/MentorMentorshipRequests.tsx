
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
import { ThumbsUp, ThumbsDown, Mail } from 'lucide-react';
import dbConnect from '@/lib/db';
import MentorshipRequest from '@/lib/models/MentorshipRequest';
import { updateMentorshipRequest } from '@/lib/actions';


async function getMyMentorshipRequests(mentorId: string) {
    await dbConnect();
    const requests = await MentorshipRequest.find({ mentor: mentorId })
        .populate('intern', 'name email avatar')
        .sort({ createdAt: -1 })
        .lean();
    return JSON.parse(JSON.stringify(requests));
}


export async function MentorMentorshipRequests({ mentorId }: { mentorId: string}) {
    const requests = await getMyMentorshipRequests(mentorId);

    const handleAccept = updateMentorshipRequest.bind(null);
    const handleReject = updateMentorshipRequest.bind(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Premium Mentorship Requests</CardTitle>
                <CardDescription>Review and respond to mentorship requests from interns.</CardDescription>
            </CardHeader>
            <CardContent>
                {requests.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        You have no pending mentorship requests.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Intern</TableHead>
                                <TableHead>Requested On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req: any) => (
                                <TableRow key={req._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={req.intern.avatar} alt={req.intern.name} data-ai-hint="avatar person" />
                                                <AvatarFallback>{req.intern.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{req.intern.name}</p>
                                                <p className="text-sm text-muted-foreground">{req.intern.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            req.status === 'Accepted' ? 'default' :
                                            req.status === 'Rejected' ? 'destructive' : 'outline'
                                        }>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'Pending' ? (
                                            <div className="flex gap-2 justify-end">
                                                <form action={handleAccept.bind(null, req._id, 'Accepted')}>
                                                    <Button variant="ghost" size="icon">
                                                        <ThumbsUp className="h-4 w-4 text-green-500"/>
                                                    </Button>
                                                </form>
                                                <form action={handleReject.bind(null, req._id, 'Rejected')}>
                                                     <Button variant="ghost" size="icon">
                                                        <ThumbsDown className="h-4 w-4 text-red-500"/>
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : req.status === 'Accepted' ? (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`mailto:${req.intern.email}`}>
                                                    <Mail className="mr-2"/> Contact Intern
                                                </a>
                                            </Button>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Responded</p>
                                        )}
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
