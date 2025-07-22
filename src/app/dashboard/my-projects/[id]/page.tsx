
import { notFound } from 'next/navigation';
import { initialData } from '@/lib/seed-data';
import type { Project } from '@/lib/types';
import { ProjectDetailsClient } from './ProjectDetailsClient';

async function getProject(id: number): Promise<Project | null> {
    // In a real app, this would fetch from a database.
    // We'll simulate that by finding it in our seed data.
    // A localStorage check would happen on the client.
    const project = initialData.projects.find(p => p.id === id) || null;
    return project;
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
        notFound();
    }

    const project = await getProject(projectId);

    if (!project) {
        notFound();
    }

  return <ProjectDetailsClient project={project} />;
}
