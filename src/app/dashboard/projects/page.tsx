
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
import { initialData } from '@/lib/seed-data';


async function getProjects() {
    await dbConnect();
    let projects = await Project.find({}).lean();
    if (!projects || projects.length === 0) {
        // Seed data if collection is empty
        await Project.insertMany(initialData.projects);
        projects = await Project.find({}).lean();
    }
    // Mongoose returns objects with _id. We convert them to strings for serialization.
    return projects.map(project => ({...project, _id: project._id.toString()}));
}

export default async function ProjectsPage() {
    const projects = await getProjects();
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Projects</h1>
                <p className="text-muted-foreground">Manage all projects and task assignments.</p>
            </div>
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
                            <div className="flex items-center pt-2 gap-2">
                             <Avatar className="h-6 w-6">
                                <AvatarImage src="https://placehold.co/100x100.png" alt={project.mentor} data-ai-hint="avatar person" />
                                <AvatarFallback>{project.mentor.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <span className="text-sm text-muted-foreground">Mentor: {project.mentor}</span>
                           </div>
                        </CardContent>
                        <CardFooter>
                           <p className="text-xs text-muted-foreground">Team: {project.team.join(', ') || 'Unassigned'}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
