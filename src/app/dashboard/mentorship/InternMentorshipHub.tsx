
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import dbConnect from "@/lib/db";
import Mentor from "@/lib/models/Mentor";
import { MentorshipRequestDialog } from './MentorshipRequestDialog';
import { getSession } from "@/lib/session";
import MentorshipRequest from "@/lib/models/MentorshipRequest";
import Intern from "@/lib/models/Intern";


async function getAllMentors() {
    await dbConnect();
    const mentors = await Mentor.find({}).lean();
    return mentors.map(mentor => ({ ...mentor, _id: mentor._id.toString() }));
}

async function getMySentRequests(internId: string) {
    await dbConnect();
    const requests = await MentorshipRequest.find({ intern: internId }).lean();
    // Return a map of mentorId to request status for quick lookup
    return new Map(requests.map(req => [req.mentor.toString(), req.status]));
}


export async function InternMentorshipHub() {
    const allMentors = await getAllMentors();
    const session = await getSession();
    const intern = await Intern.findOne({ email: session?.user.email }).lean();
    const myRequests = intern ? await getMySentRequests(intern._id.toString()) : new Map();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Mentorship Hub</h1>
                <p className="text-muted-foreground">Find and request guidance from available mentors.</p>
            </div>
             {allMentors.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground py-12">
                            <p className="text-lg font-semibold">No Mentors Available</p>
                            <p className="mt-2">There are currently no mentors available in the system.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allMentors.map((mentor) => (
                        <Card key={mentor._id}>
                            <CardHeader className="items-center text-center">
                                 <Avatar className="w-20 h-20 mb-2">
                                    <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint="avatar person" />
                                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardTitle>{mentor.name}</CardTitle>
                                <CardDescription>
                                    <Badge variant="secondary">{mentor.expertise}</Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground mt-2">
                                    Experience: {mentor.experience}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <MentorshipRequestDialog 
                                    mentorId={mentor._id.toString()} 
                                    mentorName={mentor.name} 
                                    requestStatus={myRequests.get(mentor._id.toString())}
                                />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
