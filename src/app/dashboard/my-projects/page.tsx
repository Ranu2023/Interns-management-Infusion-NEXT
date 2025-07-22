
'use client';

import { useState, useEffect } from 'react';
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
import { CheckCircle2, ListTodo, GitFork, FileText, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const initialProjects = [
  { id: 1, title: "AI Chatbot Integration", status: "In Progress", progress: 0, mentor: "Dr. Guide", tasksCompleted: 8, tasksTotal: 12, recentActivity: "Pushed new intent recognition model.", document: "https://example.com/chatbot-brief.pdf" },
  { id: 2, title: "Data Analytics Dashboard", status: "In Progress", progress: 0, mentor: "Jane Doe", tasksCompleted: 5, tasksTotal: 15, recentActivity: "Added new chart for user engagement.", document: null },
  { id: 3, title: "Mobile App Redesign", status: "Completed", progress: 100, mentor: "John Smith", tasksCompleted: 20, tasksTotal: 20, recentActivity: "Final version approved and merged.", document: "https://example.com/mobile-redesign-spec.pdf" },
];

export default function MyProjectsPage() {
    const [projects, setProjects] = useState(initialProjects.map(p => ({
        ...p,
        progress: p.status === 'Completed' ? 100 : Math.round((p.tasksCompleted / p.tasksTotal) * 100)
    })));

    useEffect(() => {
        // This effect updates the status if tasks are completed.
        // In a real app, you might have a function to increment tasksCompleted.
        setProjects(currentProjects => currentProjects.map(p => {
            const progress = Math.round((p.tasksCompleted / p.tasksTotal) * 100);
            const status = progress === 100 ? 'Completed' : 'In Progress';
            return { ...p, progress, status };
        }));
    }, []);


    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Projects</h1>
                <p className="text-muted-foreground">View your assigned projects and update your progress.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="flex flex-col">
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
                                        <Label htmlFor={`progress-${project.id}`}>Overall Progress</Label>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <Slider
                                        id={`progress-${project.id}`}
                                        value={[project.progress]}
                                        max={100}
                                        step={1}
                                        disabled={true} // The slider is now a read-only indicator
                                    />
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
                        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4 mt-4">
                            <GitFork className="h-4 w-4" />
                            <span>{project.recentActivity}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
