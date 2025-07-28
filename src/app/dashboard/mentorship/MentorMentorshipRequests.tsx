
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
import { ThumbsUp, ThumbsDown, Mail, Eye } from 'lucide-react';
import dbConnect from '@/lib/db';
import MentorshipRequest, { type IMentorshipRequest } from '@/lib/models/MentorshipRequest';
import { updateMentorshipRequest } from '@/lib/actions';
import { getSession } from "@/lib/session";
import { User as AuthUser } from "@/context/AuthContext";
import Intern, { type IIntern } from "@/lib/models/Intern";
import Link from 'next/link';
import mongoose from 'mongoose';

type PopulatedRequest = Omit<IMentorshipRequest, 'intern'> & {
  _id: string;
  intern: IIntern;
  createdAt: string;
  sessionId?: string;
};

async function getMyMentorshipRequests(mentorId: string): Promise<PopulatedRequest[]> {
  await dbConnect();
  
  Intern; 
  
  const requests = await MentorshipRequest.find({ mentor: new mongoose.Types.ObjectId(mentorId) })
    .populate<{ intern: IIntern }>({
      path: 'intern',
      model: Intern,
      select: 'name email avatar',
    })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(requests));
}

export async function MentorMentorshipRequests() {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'mentor') return null;
  
  const mentorId = session.user.id;
  const requests = await getMyMentorshipRequests(mentorId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Mentorship Requests</CardTitle>
        <CardDescription>
          Review and respond to mentorship requests from interns.
        </CardDescription>
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
              {requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>
                    {req.intern ? (
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={req.intern.avatar || 'https://placehold.co/100x100.png'}
                            alt={req.intern.name}
                            data-ai-hint="avatar person"
                          />
                          <AvatarFallback>
                            {req.intern.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{req.intern.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {req.intern.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Unknown Intern
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.status === "Accepted"
                          ? "default"
                          : req.status === "Rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "Pending" ? (
                      <div className="flex gap-2 justify-end">
                        <form action={updateMentorshipRequest.bind(null, req._id, "Accepted")}>
                          <Button variant="ghost" size="icon" type="submit" title="Accept">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                          </Button>
                        </form>
                        <form action={updateMentorshipRequest.bind(null, req._id, "Rejected")}>
                          <Button variant="ghost" size="icon" type="submit" title="Reject">
                            <ThumbsDown className="h-4 w-4 text-red-500" />
                          </Button>
                        </form>
                      </div>
                    ) : req.status === "Accepted" && req.sessionId ? (
                      <Button variant="outline" size="sm" asChild>
                         <Link href={`/dashboard/mentorship/${req.sessionId}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Session
                         </Link>
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
