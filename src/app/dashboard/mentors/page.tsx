
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
import { initialData } from '@/lib/seed-data';

async function getMentors() {
    await dbConnect();
    let mentors = await Mentor.find({}).lean();
    if (!mentors || mentors.length === 0) {
        // Seed data if collection is empty
        await Mentor.insertMany(initialData.mentors);
        mentors = await Mentor.find({}).lean();
    }
    // Mongoose returns objects with _id. We convert them to strings for serialization.
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
                                            <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint="avatar person" />
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
            </CardContent>
        </Card>
    );
}
