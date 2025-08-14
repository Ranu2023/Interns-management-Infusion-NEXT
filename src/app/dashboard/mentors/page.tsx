
'use server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import dbConnect from '@/lib/db';
import Mentor from '@/lib/models/Mentor';

async function getMentors() {
    await dbConnect();
    // This page is for HR/Admins, so we fetch all mentors.
    // The on-the-fly seeding logic is removed.
    let mentors = await Mentor.find({}).lean();
    return mentors.map(mentor => ({...mentor, _id: mentor._id.toString()}));
}

export default async function MentorsPage() {
    const mentors = await getMentors();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mentor Management</CardTitle>
                <CardDescription>View and manage all mentors.</CardDescription>
            </CardHeader>
            <CardContent>
                {mentors.length === 0 ? (
                     <div className="text-center text-muted-foreground py-12">
                        No mentor records found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mentor</TableHead>
                                <TableHead>Expertise</TableHead>
                                <TableHead className="text-center">Interns Assigned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mentors.map((mentor) => (
                                <TableRow key={mentor._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={mentor.avatar || `https://placehold.co/100x100.png`} alt={mentor.name} data-ai-hint="avatar person" />
                                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{mentor.name}</p>
                                                <p className="text-sm text-muted-foreground">{mentor.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{mentor.expertise}</TableCell>
                                    <TableCell className="text-center">{mentor.interns}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
