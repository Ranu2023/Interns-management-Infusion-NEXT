
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import dbConnect from "@/lib/db";
import Mentor from "@/lib/models/Mentor";
import { MentorshipRequestDialog } from './MentorshipRequestDialog';


async function getAllMentors() {
    await dbConnect();
    const mentors = await Mentor.find({}).lean();
    return mentors.map(mentor => ({ ...mentor, _id: mentor._id.toString() }));
}


export async function InternMentorshipHub() {
    const allMentors = await getAllMentors();

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
                            </CardHeader>
                            <CardContent className="text-center">
                                <Badge variant="secondary">{mentor.expertise}</Badge>
                                <p className="text-sm text-muted-foreground mt-2">
                                    An experienced professional in {mentor.expertise.toLowerCase()} looking to help the next generation of talent.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <MentorshipRequestDialog mentorId={mentor._id} mentorName={mentor.name} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
