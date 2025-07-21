
'use client';

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
import { FileSearch } from "lucide-react";

const applications = [
  { id: 1, name: "Liam Smith", university: "Tech University", date: "2024-06-01", status: "Pending" },
  { id: 2, name: "Olivia Jones", university: "State College", date: "2024-06-02", status: "Reviewed" },
  { id: 3, name: "Noah Taylor", university: "Ivy League Institute", date: "2024-06-02", status: "Accepted" },
  { id: 4, name: "Emma Brown", university: "City University", date: "2024-06-03", status: "Rejected" },
  { id: 5, name: "Oliver Wilson", university: "Tech University", date: "2024-06-04", status: "Pending" },
  { id: 6, name: "Ava Garcia", university: "State College", date: "2024-06-05", status: "Pending" },
  { id: 7, name: "Elijah Martinez", university: "Ivy League Institute", date: "2024-06-05", status: "Reviewed" },
  { id: 8, name: "Sophia Anderson", university: "City University", date: "2024-06-06", status: "Accepted" },
  { id: 9, name: "James Thomas", university: "Tech University", date: "2024-06-07", status: "Pending" },
  { id: 10, name: "Isabella Hernandez", university: "State College", date: "2024-06-08", status: "Rejected" },
];

export default function ApplicationsPage() {
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
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.name}</TableCell>
                                <TableCell>{app.university}</TableCell>
                                <TableCell>{app.date}</TableCell>
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
                                    <Button variant="outline" size="sm">
                                        <FileSearch className="mr-2 h-4 w-4" />
                                        Review
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
