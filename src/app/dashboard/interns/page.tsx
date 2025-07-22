
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { initialData } from '@/lib/seed-data';


async function getInterns() {
  await dbConnect();
  let interns = await Intern.find({}).lean();
  if (!interns || interns.length === 0) {
      // Seed data if collection is empty
      await Intern.insertMany(initialData.interns);
      interns = await Intern.find({}).lean();
  }
  // Mongoose returns objects with _id. We convert them to strings for serialization.
  return interns.map(intern => ({...intern, _id: intern._id.toString()}));
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
                            <TableHead className="text-right">Profile</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interns.map((intern) => (
                            <TableRow key={intern._id}>
                                <TableCell className="font-medium">{intern.name}</TableCell>
                                <TableCell>{intern.email}</TableCell>
                                <TableCell>{intern.project}</TableCell>
                                <TableCell>{intern.mentor}</TableCell>
                                <TableCell>
                                    <Badge variant={intern.status === 'Active' ? 'default' : intern.status === 'Completed' ? 'secondary' : 'destructive'}>
                                        {intern.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/dashboard/intern/${intern._id}`}>
                                            View <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
