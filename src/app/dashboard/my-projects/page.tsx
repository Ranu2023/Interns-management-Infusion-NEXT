
'use server';

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import type { IProject } from '@/lib/models/Project';
import Intern from '@/lib/models/Intern';
import { ProjectCard } from './ProjectCard';
import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

// Helper function to safely stringify objects for passing to client components
function safeJsonStringify(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

async function getMyProjects(): Promise<IProject[]> {
    const session = await getSession();
    const user = session?.user as User;

    if (!user || user.role !== 'intern') {
        redirect('/dashboard');
    }
    
    await dbConnect();
    const intern = await Intern.findOne({ email: user.email }).lean();
    if (!intern) return [];
    
    // Find projects where the intern's name is in the 'team' array
    const projects = await Project.find({ team: intern.name }).lean();
    return safeJsonStringify(projects);
}

export default async function MyProjectsPage() {
    const projects = await getMyProjects();
    
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
             {projects.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground py-12">
                            <p className="text-lg font-semibold">No Projects Assigned Yet</p>
                            <p className="mt-2">Welcome! Your mentor will assign you a project soon. Please check back later.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {processedProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
