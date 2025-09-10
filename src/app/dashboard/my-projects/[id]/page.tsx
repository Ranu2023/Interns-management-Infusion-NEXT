
'use server';

import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Project from '@/lib/models/Project';
import { ProjectDetailsClient } from './ProjectDetailsClient';
import { logActivity } from '@/lib/actions';
import { getSession } from '@/lib/session';

// Helper function to safely stringify objects for passing to client components
function safeJsonStringify(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

async function getProject(id: string): Promise<any | null> {
    try {
        await dbConnect();
        const project = await Project.findById(id).lean();
        if (!project) return null;

        const session = await getSession();
        if (session?.user && session.user.role === 'intern') {
            await logActivity(session.user.id, `Viewed project: ${project.title}`);
        }

        return project ? safeJsonStringify(project) : null;
    } catch (error) {
        console.error("Failed to fetch project", error);
        return null;
    }
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
    
    // Validate ID format before hitting the DB
    if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
        notFound();
    }

    const project = await getProject(params.id);

    if (!project) {
        notFound();
    }

  return <ProjectDetailsClient project={project} />;
}
