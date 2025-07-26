
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import { getSession } from "@/lib/session";
import { User } from "@/context/AuthContext";
import { redirect } from "next/navigation";

async function getMyAssignedProjects() {
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user.role !== 'mentor') redirect('/dashboard');
    
    await dbConnect();
    // This page is for Mentors, so we fetch all projects they are mentoring.
    const projects = await Project.find({ mentor: user.name }).lean();
    return projects.map(project => ({...project, _id: project._id.toString()}));
}

export default async function MentorProjectsPage() {
    const projects = await getMyAssignedProjects();
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Assigned Projects</h1>
                <p className="text-muted-foreground">An overview of projects managed by you.</p>
            </div>
             {projects.length === 0 ? (
                 <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground py-12">
                            You are not mentoring any projects yet.
                        </div>
                    </CardContent>
                </Card>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project._id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                    <Badge variant={project.status === 'In Progress' ? 'default' : project.status === 'Completed' ? 'secondary' : project.status === 'On-Hold' ? 'destructive' : 'outline'}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <CardDescription className="text-sm pt-1">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} />
                                </div>
                            </CardContent>
                            <CardFooter>
                            <p className="text-xs text-muted-foreground">Team: {project.team.join(', ') || 'Unassigned'}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             )}
        </div>
    );
}
