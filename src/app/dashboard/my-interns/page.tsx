
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const myInterns = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com", project: "AI Chatbot", progress: 60, status: "On Track", avatar: "https://placehold.co/100x100.png" },
  { id: 2, name: "Fiona Garcia", email: "fiona.g@example.com", project: "AI Chatbot", progress: 75, status: "On Track", avatar: "https://placehold.co/100x100.png" },
  { id: 3, name: "Bob Williams", email: "bob.w@example.com", project: "Data Analytics", progress: 45, status: "Needs Attention", avatar: "https://placehold.co/100x100.png" },
  { id: 4, name: "George Rodriguez", email: "george.r@example.com", project: "Data Analytics", progress: 30, status: "On Track", avatar: "https://placehold.co/100x100.png" },
  { id: 5, name: "Charlie Brown", email: "charlie.b@example.com", project: "Mobile App", progress: 100, status: "Completed", avatar: "https://placehold.co/100x100.png" },
  { id: 6, name: "Hannah Martinez", email: "hannah.m@example.com", project: "Mobile App", progress: 100, status: "Completed", avatar: "https://placehold.co/100x100.png" },
  { id: 7, name: "Diana Miller", email: "diana.m@example.com", project: "UI/UX Design", progress: 85, status: "On Track", avatar: "https://placehold.co/100x100.png" },
  { id: 8, name: "Ian Hernandez", email: "ian.h@example.com", project: "UI/UX Design", progress: 90, status: "Exceeding", avatar: "https://placehold.co/100x100.png" },
  { id: 9, name: "Ethan Davis", email: "ethan.d@example.com", project: "Cloud Migration", progress: 20, status: "On Track", avatar: "https://placehold.co/100x100.png" },
  { id: 10, name: "Jasmine Lopez", email: "jasmine.l@example.com", project: "Cloud Migration", progress: 25, status: "Needs Attention", avatar: "https://placehold.co/100x100.png" },
];

export default function MyInternsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Interns</CardTitle>
                <CardDescription>View and manage the interns assigned to you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Intern</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myInterns.map((intern) => (
                            <TableRow key={intern.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={intern.avatar} alt={intern.name} data-ai-hint="avatar person" />
                                            <AvatarFallback>{intern.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{intern.name}</p>
                                            <p className="text-sm text-muted-foreground">{intern.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{intern.project}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={intern.progress} className="w-24" />
                                        <span className="text-sm text-muted-foreground">{intern.progress}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <Badge variant={
                                        intern.status === 'On Track' ? 'default' :
                                        intern.status === 'Completed' ? 'secondary' :
                                        intern.status === 'Exceeding' ? 'default' : // Should be different color
                                        'destructive'
                                    }>
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
