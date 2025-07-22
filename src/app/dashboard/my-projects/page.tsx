
'use server';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, ListTodo, GitFork, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import type { IProject } from '@/lib/models/Project';
import Intern from '@/lib/models/Intern';

// Helper function to safely stringify objects for passing to client components
function safeJsonStringify(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

async function getMyProjects(userEmail: string): Promise<IProject[]> {
    await dbConnect();
    const intern = await Intern.findOne({ email: userEmail }).lean();
    if (!intern) return [];
    
    const projects = await Project.find({ team: intern.name }).lean();
    return safeJsonStringify(projects);
}

export default async function MyProjectsPage() {
    // In a real app, you'd get this from context/session
    const userEmail = "intern@synergy.com";
    const projects = await getMyProjects(userEmail);
    
    const processedProjects = projects.map(p => {
        if (!p.tasks || p.tasks.length === 0) {
            return { ...p, tasksCompleted: 0, tasksTotal: 0, progress: p.progress || 0 };
        }
        const tasksCompleted = p.tasks.filter(task => task.completed).length;
        const tasksTotal = p.tasks.length;
        const progress = p.progress || 0;
        const status = p.status;
        return { ...p, tasksCompleted, tasksTotal, progress, status };
    });


    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Projects</h1>
                <p className="text-muted-foreground">View your assigned projects and update your progress.</p>
            </div>
             {projects.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">You have not been assigned any projects yet.</p>
                    </CardContent>
                </Card>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedProjects.map((project) => (
                    <Link key={project._id} href={`/dashboard/my-projects/${project._id}`} className="flex">
                        <Card 
                            className="flex flex-col h-full hover:border-primary transition-all w-full"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                    <Badge variant={project.status === 'In Progress' ? 'default' : project.status === 'Completed' ? 'secondary' : 'destructive'}>
                                        {project.status}
                                    </Badge>
                                </div>
                               <div className="flex items-center pt-2 gap-2">
                                 <Avatar className="h-6 w-6">
                                    <AvatarImage src="https://placehold.co/100x100.png" alt={project.mentor} data-ai-hint="avatar person" />
                                    <AvatarFallback>{project.mentor.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 <span className="text-sm text-muted-foreground">Mentor: {project.mentor}</span>
                               </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center text-sm mb-1">
                                            <p>Overall Progress</p>
                                            <span>{Math.round(project.progress || 0)}%</span>
                                        </div>
                                         <Progress value={project.progress} />
                                    </div>
                                    <div className="flex justify-around text-center text-sm">
                                        <div>
                                            <CheckCircle2 className="h-5 w-5 mx-auto text-primary" />
                                            <p className="font-semibold">{project.tasksCompleted}</p>
                                            <p className="text-xs text-muted-foreground">Tasks Done</p>
                                        </div>
                                        <div>
                                            <ListTodo className="h-5 w-5 mx-auto text-primary" />
                                            <p className="font-semibold">{project.tasksTotal}</p>
                                            <p className="text-xs text-muted-foreground">Total Tasks</p>
                                        </div>
                                        {project.document && (
                                        <div>
                                            <FileText className="h-5 w-5 mx-auto text-primary" />
                                            <p className="font-semibold">1</p>
                                            <p className="text-xs text-muted-foreground">Document</p>
                                        </div>
                                        )}
                                    </div>
                                </div>
                                {project.document && (
                                     <Button variant="outline" className="w-full" asChild>
                                         <a href={project.document} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                            <Download className="mr-2" />
                                            Download Project Brief
                                         </a>
                                     </Button>
                                )}
                            </CardContent>
                            <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4 mt-auto">
                                <GitFork className="h-4 w-4" />
                                <span>{project.recentActivity}</span>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
