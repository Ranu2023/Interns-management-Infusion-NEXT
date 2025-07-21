
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const interns = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com", project: "AI Chatbot", mentor: "Dr. Guide", status: "Active" },
  { id: 2, name: "Bob Williams", email: "bob.w@example.com", project: "Data Analytics", mentor: "Jane Doe", status: "Active" },
  { id: 3, name: "Charlie Brown", email: "charlie.b@example.com", project: "Mobile App", mentor: "John Smith", status: "Completed" },
  { id: 4, name: "Diana Miller", email: "diana.m@example.com", project: "UI/UX Design", mentor: "Emily White", status: "Active" },
  { id: 5, name: "Ethan Davis", email: "ethan.d@example.com", project: "Cloud Migration", mentor: "Michael Green", status: "On-Hold" },
  { id: 6, name: "Fiona Garcia", email: "fiona.g@example.com", project: "AI Chatbot", mentor: "Dr. Guide", status: "Active" },
  { id: 7, name: "George Rodriguez", email: "george.r@example.com", project: "Data Analytics", mentor: "Jane Doe", status: "Active" },
  { id: 8, name: "Hannah Martinez", email: "hannah.m@example.com", project: "Mobile App", mentor: "John Smith", status: "Completed" },
  { id: 9, name: "Ian Hernandez", email: "ian.h@example.com", project: "UI/UX Design", mentor: "Emily White", status: "Active" },
  { id: 10, name: "Jasmine Lopez", email: "jasmine.l@example.com", project: "Cloud Migration", mentor: "Michael Green", status: "Active" },
];

export default function InternsPage() {
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
