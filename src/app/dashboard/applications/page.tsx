
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import dbConnect from '@/lib/db';
import Application from '@/lib/models/Application';
import type { IApplication } from '@/lib/models/Application';

async function getApplications(): Promise<(IApplication & {_id: string})[]> {
  try {
    await dbConnect();
    let applications = await Application.find({}).sort({ date: -1 }).lean();
    
    // Mongoose returns objects with _id. We convert them to strings for serialization.
    return applications.map(app => ({
        ...app, 
        _id: app._id.toString(),
        date: app.date.toISOString() // Ensure date is a string
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}


export default async function ApplicationsPage() {
    const applications = await getApplications();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Review and manage intern applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant Name</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Applied On</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app._id}>
                                <TableCell className="font-medium">{app.name}</TableCell>
                                <TableCell>{app.university}</TableCell>
                                <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        app.status === 'Accepted' ? 'default' :
                                        app.status === 'Rejected' ? 'destructive' :
                                        app.status === 'Reviewed' ? 'secondary' : 'outline'
                                    }>
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/dashboard/applications/${app._id}`}>
                                           Review <ArrowRight className="ml-2 h-4 w-4" />
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
