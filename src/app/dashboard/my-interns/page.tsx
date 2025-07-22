
'use server';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import Project from '@/lib/models/Project';

async function getMyInterns(mentorName: string) {
    await dbConnect();
    const interns = await Intern.find({ mentor: mentorName }).lean();
    
    const projects = await Project.find({
      title: { $in: interns.map(i => i.project) }
    }).lean();

    const projectProgressMap = new Map(projects.map(p => [p.title, p.progress || 0]));

    return interns.map(intern => ({
        ...intern,
        _id: intern._id.toString(),
        progress: projectProgressMap.get(intern.project) || 0,
        avatar: "https://placehold.co/100x100.png",
    }));
}


export default async function MyInternsPage() {
    // In a real app, you'd get the mentor's name from the session/auth context
    const myInterns = await getMyInterns("Dr. Guide");

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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myInterns.map((intern) => (
                            <TableRow key={intern._id}>
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
                                     <Badge variant={intern.status === 'Active' ? 'default' : 'secondary'}>
                                        {intern.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/dashboard/intern/${intern._id}`}>
                                            Manage <ArrowRight className="ml-2 h-4 w-4" />
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
