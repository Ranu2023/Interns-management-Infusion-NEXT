
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
import { getDb } from "@/lib/mongodb";
import { type Mentor } from "@/lib/types";

async function getMentors() {
    const db = await getDb();
    const mentors = await db.collection<Mentor>('mentors').find({}, { projection: { _id: 0 } }).toArray();
    return mentors;
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
                            <TableRow key={mentor.id}>
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

// Revalidate the page every 60 seconds to fetch fresh data
export const revalidate = 60;
