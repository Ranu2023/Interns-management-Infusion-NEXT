
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
import { getDb } from "@/lib/mongodb";
import { type Intern } from "@/lib/types";

async function getInterns() {
  const db = await getDb();
  // Using .project() to exclude the _id field from the result
  const interns = await db.collection<Intern>('interns').find({}, { projection: { _id: 0 } }).toArray();
  return interns;
}

export default async function InternsPage() {
    const interns = await getInterns();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Management</CardTitle>
                <CardDescription>View and manage all interns in the program.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Mentor</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interns.map((intern) => (
                            <TableRow key={intern.id}>
                                <TableCell className="font-medium">{intern.name}</TableCell>
                                <TableCell>{intern.email}</TableCell>
                                <TableCell>{intern.project}</TableCell>
                                <TableCell>{intern.mentor}</TableCell>
                                <TableCell>
                                    <Badge variant={intern.status === 'Active' ? 'default' : intern.status === 'Completed' ? 'secondary' : 'destructive'}>
                                        {intern.status}
                                    </Badge>
                                </TableCell>
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
