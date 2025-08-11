
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
import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';


async function getMyInterns() {
    const session = await getSession();
    const user = session?.user as User;

    if (!user || user.role !== 'mentor') {
        // This page is for mentors only, redirect or show an error if accessed by others
        redirect('/dashboard');
    }

    await dbConnect();
    // Fetch interns where the mentor field matches the logged-in mentor's name
    const interns = await Intern.find({ mentor: user.name }).lean();
    
    const projects = await Project.find({
      title: { $in: interns.map(i => i.project) }
    }).lean();

    const projectProgressMap = new Map(projects.map(p => [p.title, p.progress || 0]));

    return interns.map(intern => ({
        ...intern,
        _id: intern._id.toString(),
        progress: projectProgressMap.get(intern.project) || 0,
    }));
}


export default async function MyInternsPage() {
    const myInterns = await getMyInterns();

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Interns</CardTitle>
                <CardDescription>View and manage the interns assigned to you.</CardDescription>
            </CardHeader>
            <CardContent>
                {myInterns.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        You have not been assigned any interns yet.
                    </div>
                ) : (
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
                                                <AvatarImage src={intern.avatar} alt={intern.name} />
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
                )}
            </CardContent>
        </Card>
    );
}
