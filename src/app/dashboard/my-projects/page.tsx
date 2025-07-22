
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { initialData } from '@/lib/seed-data';
import type { Project, Task } from '@/lib/types';


async function getMyProjects(userEmail: string): Promise<Project[]> {
    // In a real app, this would be an API call or a server action
    // that filters projects based on the logged-in intern's email.
    // We'll simulate this by filtering the seed data.
    const intern = initialData.interns.find(i => i.email === userEmail);
    if (!intern) return [];
    
    // In a real app, we would fetch the projects directly by title or ID.
    const projectTitles = [intern.project];
    const projects = initialData.projects.filter(p => projectTitles.includes(p.title));
    return projects as Project[];
}

export default function MyProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            // For now, we simulate a user. In a real app, you'd get this from context.
            const userEmail = "intern@synergy.com";
            // This local storage logic will be replaced by DB fetching on the details page.
            const savedProjects = localStorage.getItem('projectsData');
            
            let dataToSet;
            if (savedProjects) {
                dataToSet = JSON.parse(savedProjects);
            } else {
                dataToSet = await getMyProjects(userEmail);
                localStorage.setItem('projectsData', JSON.stringify(dataToSet));
            }
            setProjects(dataToSet);
            setLoading(false);
        }
        fetchProjects();
    }, []);
    
    const processedProjects = useMemo(() => {
        return projects.map(p => {
            if (!p.tasks || p.tasks.length === 0) {
                return { ...p, tasksCompleted: 0, tasksTotal: 0, progress: p.progress || 0 };
            }
            const tasksCompleted = p.tasks.filter(task => task.completed).length;
            const tasksTotal = p.tasks.length;
            const progress = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
            const status = progress === 100 ? 'Completed' : 'In Progress';
            return { ...p, tasksCompleted, tasksTotal, progress, status };
        });
    }, [projects]);

    const handleCardClick = (e: React.MouseEvent, projectId: number) => {
        // Don't navigate if a button/link inside the card was clicked
        if ((e.target as HTMLElement).closest('a,button')) {
            return;
        }
        router.push(`/dashboard/my-projects/${projectId}`);
    };

    if (loading) {
         return (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Projects</h1>
                <p className="text-muted-foreground">View your assigned projects and update your progress.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedProjects.map((project) => (
                    <Card 
                        key={project.id}
                        className="flex flex-col h-full hover:border-primary transition-all cursor-pointer"
                        onClick={(e) => handleCardClick(e, project.id)}
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
                                        <span>{project.progress}%</span>
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
                                     <a href={project.document} target="_blank" rel="noopener noreferrer">
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
                ))}
            </div>
        </div>
    );
}
