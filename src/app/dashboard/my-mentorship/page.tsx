
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
import { Eye, Handshake } from 'lucide-react';
import dbConnect from '@/lib/db';
import MentorshipRequest from '@/lib/models/MentorshipRequest';
import { getSession } from "@/lib/session";
import { User as AuthUser } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import Intern from "@/lib/models/Intern";
import Mentor, { type IMentor } from "@/lib/models/Mentor";
import mongoose from "mongoose";
import Link from "next/link";


type PopulatedRequest = {
  _id: string;
  mentor: IMentor;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  sessionId?: string;
};

async function getMyMentorships(internId: string): Promise<PopulatedRequest[]> {
  await dbConnect();
  
  const requests = await MentorshipRequest.find({ intern: new mongoose.Types.ObjectId(internId) })
    .populate<{ mentor: IMentor }>({
      path: 'mentor',
      model: Mentor,
      select: 'name email avatar expertise',
    })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(requests));
}

export default async function MyMentorshipPage() {
  const session = await getSession();
  const user = session?.user as AuthUser;

  if (!user || user.role !== 'intern') redirect('/dashboard');
  
  const internProfile = await Intern.findOne({ email: user.email }).lean();
  
  if (!internProfile) {
       return (
        <Card>
            <CardHeader>
                <CardTitle>My Mentorships</CardTitle>
                <CardDescription>Track the status of your mentorship requests.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="text-center text-muted-foreground py-12">
                    <h3 className="text-lg font-semibold">Intern Profile Not Found</h3>
                    <p className="mt-2 text-sm">We could not find your intern profile. Please contact support.</p>
                </div>
            </CardContent>
        </Card>
       )
  }

  const mentorships = await getMyMentorships(internProfile._id.toString());

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Mentorships</CardTitle>
        <CardDescription>
          Track the status of your mentorship requests and connect with your mentors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mentorships.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <Handshake className="mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold">No Mentorship Requests Sent</h3>
            <p className="mt-2 text-sm">
              You haven't requested any mentorship sessions yet.
            </p>
            <Button asChild className="mt-4">
                <Link href="/dashboard/mentorship">Explore Mentors</Link>
            </Button>
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
                          <AvatarImage
                            src={req.mentor.avatar}
                            alt={req.mentor.name}
                            data-ai-hint="avatar person"
                          />
                          <AvatarFallback>
                            {req.mentor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{req.mentor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {req.mentor.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Mentor not found
                      </p>
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
                    <Badge
                      variant={
                        req.status === "approved"
                          ? "default"
                          : req.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "approved" && req.sessionId ? (
                      <Button asChild>
                        <Link href={`/dashboard/mentorship/${req.sessionId}`}>
                          <Eye className="mr-2 h-4 w-4" /> Open Mentorship Room
                        </Link>
                      </Button>
                    ) : req.status === 'pending' ? (
                      <span className="text-xs text-muted-foreground">
                        Awaiting response
                      </span>
                    ) : req.status === 'rejected' ? (
                      <span className="text-xs text-muted-foreground">
                        Not accepted
                      </span>
                    ) : null}
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
