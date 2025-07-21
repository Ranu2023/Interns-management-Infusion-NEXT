
'use client';

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
import { CheckCircle2, ListTodo, GitFork } from 'lucide-react';

const projects = [
  { id: 1, title: "AI Chatbot Integration", status: "In Progress", progress: 60, mentor: "Dr. Guide", tasksCompleted: 8, tasksTotal: 12, recentActivity: "Pushed new intent recognition model." },
  { id: 2, title: "Data Analytics Dashboard", status: "In Progress", progress: 45, mentor: "Jane Doe", tasksCompleted: 5, tasksTotal: 15, recentActivity: "Added new chart for user engagement." },
  { id: 3, title: "Mobile App Redesign", status: "Completed", progress: 100, mentor: "John Smith", tasksCompleted: 20, tasksTotal: 20, recentActivity: "Final version approved and merged." },
];

const otherProjects = [
    { id: 4, title: "UI/UX Improvement", status: "In Progress", progress: 75, mentor: "Emily White", },
    { id: 5, title: "Cloud Migration Strategy", status: "On-Hold", progress: 20, mentor: "Michael Green", },
    { id: 6, title: "E-commerce Platform", status: "Not Started", progress: 0, mentor: "Sarah Black" },
    { id: 7, title: "Internal Tooling", status: "In Progress", progress: 80, mentor: "David King" },
    { id: 8, title: "API Security Audit", status: "In Progress", progress: 30, mentor: "Kevin Scott" },
    { id: 9, title: "Marketing Website", status: "Completed", progress: 100, mentor: "Olivia Adams" },
    { id: 10, title: "Onboarding Flow", status: "Not Started", progress: 0, mentor: "Emily White" },
]


export default function MyProjectsPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Projects</h1>
                <p className="text-muted-foreground">View your assigned projects and tasks.</p>
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
                        <CardContent className="flex-grow">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="text-muted-foreground">Overall Progress</span>
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
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4 mt-4">
                            <GitFork className="h-4 w-4" />
                            <span>{project.recentActivity}</span>
                        </CardFooter>
                    </Card>
                ))}
                 {otherProjects.map((project) => (
                    <Card key={project.id} className="flex flex-col bg-muted/30">
                         <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <Badge variant={project.status === 'In Progress' ? 'default' : project.status === 'Completed' ? 'secondary' : project.status === 'On-Hold' ? 'destructive' : 'outline'}>
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
                        <CardContent>
                             <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
