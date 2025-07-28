
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
import { getSession } from "@/lib/session";
import { User as AuthUser } from "@/context/AuthContext";
import { type IIntern } from "@/lib/models/Intern";
import { type IMentor } from "@/lib/models/Mentor";
import { type IMentorshipRequest } from "@/lib/models/MentorshipRequest";
import mongoose from "mongoose";
import Intern from "@/lib/models/Intern";
import Mentor from "@/lib/models/Mentor";

type PopulatedRequest = Omit<IMentorshipRequest, 'intern'> & {
  _id: string;
  intern: IIntern;
  createdAt: string;
};

async function getMyMentorshipRequests(mentorId: string): Promise<PopulatedRequest[]> {
  await dbConnect();
  
  // Ensure related models are registered to be used in populate
  Intern;
  Mentor;

  const requests = await MentorshipRequest.find({ mentor: new mongoose.Types.ObjectId(mentorId) })
    .populate<{ intern: IIntern }>({
      path: 'intern',
      model: Intern, // Use the imported model directly
      select: 'name email avatar',
    })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(requests));
}

export async function MentorMentorshipRequests() {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'mentor') return null;

  const mentorProfile = await Mentor.findOne({email: session.user.email});
  if (!mentorProfile) {
    return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Could not load your mentor profile.</p>
            </CardContent>
        </Card>
    )
  }
  
  const requests = await getMyMentorshipRequests(mentorProfile._id.toString());

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
                            src={req.intern.avatar}
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
                    ) : req.status === "Accepted" && req.intern ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${req.intern.email}`}>
                          <Mail className="mr-2" /> Contact Intern
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
