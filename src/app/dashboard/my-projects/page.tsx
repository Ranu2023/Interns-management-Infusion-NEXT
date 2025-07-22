
'use server';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import type { IProject } from '@/lib/models/Project';
import Intern from '@/lib/models/Intern';
import { ProjectCard } from './ProjectCard';

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
                   <ProjectCard key={project._id} project={project} />
                ))}
            </div>
        </div>
    );
}
