
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

const projects = [
  { id: 1, title: "AI Chatbot Integration", description: "Integrate a new AI-powered chatbot into the customer support platform.", status: "In Progress", progress: 60, team: ["Alice", "Fiona"] },
  { id: 2, title: "Data Analytics Dashboard", description: "Develop a dashboard for visualizing key business metrics and KPIs.", status: "In Progress", progress: 45, team: ["Bob", "George"] },
  { id: 3, title: "Mobile App Redesign", description: "Complete redesign of the flagship mobile application for iOS and Android.", status: "Completed", progress: 100, team: ["Charlie", "Hannah"] },
  { id: 4, title: "UI/UX Improvement", description: "Conduct user research and implement UI/UX improvements across the website.", status: "In Progress", progress: 75, team: ["Diana", "Ian"] },
  { id: 5, title: "Cloud Migration Strategy", description: "Plan and execute the migration of legacy systems to a cloud-based infrastructure.", status: "On-Hold", progress: 20, team: ["Ethan", "Jasmine"] },
  { id: 6, title: "E-commerce Platform", description: "Build a new e-commerce platform from scratch.", status: "Not Started", progress: 0, team: [] },
  { id: 7, title: "Internal Tooling", description: "Develop internal tools to improve developer productivity.", status: "In Progress", progress: 80, team: [] },
  { id: 8, title: "API Security Audit", description: "Perform a comprehensive security audit of all public-facing APIs.", status: "In Progress", progress: 30, team: [] },
  { id: 9, title: "Marketing Website", description: "Create a new marketing website to showcase products.", status: "Completed", progress: 100, team: [] },
  { id: 10, title: "Onboarding Flow", description: "Redesign the user onboarding flow for new customers.", status: "Not Started", progress: 0, team: [] },
];

export default function ProjectsPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Projects</h1>
                <p className="text-muted-foreground">Manage all projects and task assignments.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <Badge variant={project.status === 'In Progress' ? 'default' : project.status === 'Completed' ? 'secondary' : project.status === 'On-Hold' ? 'destructive' : 'outline'}>
                                    {project.status}
                                </Badge>
                            </div>
                            <CardDescription className="text-sm pt-1">{project.description}</CardDescription>
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
                        <CardFooter>
                           <p className="text-xs text-muted-foreground">Team: {project.team.join(', ') || 'Unassigned'}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
