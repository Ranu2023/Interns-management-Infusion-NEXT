'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from './db';
import Project from './models/Project';
import Application from './models/Application';
import Intern from './models/Intern';
import { type Task } from './types';

export async function updateTaskCompletion(projectId: string, taskId: number, completed: boolean) {
  try {
    await dbConnect();
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    const task = project.tasks.find((t: Task) => t.id === taskId);
    if (task) {
      task.completed = completed;
    }

    // Recalculate progress
    const completedTasks = project.tasks.filter((t: Task) => t.completed).length;
    project.progress = (completedTasks / project.tasks.length) * 100;
    project.status = project.progress === 100 ? 'Completed' : 'In Progress';


    await project.save();
    revalidatePath(`/dashboard/my-projects/${projectId}`);
    revalidatePath(`/dashboard/my-projects`);
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error('Failed to update task.');
  }
}

export async function updateApplicationStatus(applicationId: string, status: 'Accepted' | 'Rejected') {
    try {
        await dbConnect();
        await Application.findByIdAndUpdate(applicationId, { status });
        revalidatePath(`/dashboard/applications`);
        revalidatePath(`/dashboard/applications/${applicationId}`);
    } catch (error) {
        console.error('Failed to update application status', error);
        throw new Error('Failed to update application status.');
    }
}

export async function assignProject(formData: FormData) {
    try {
        await dbConnect();

        const internId = formData.get('internId') as string;
        const projectName = formData.get('projectName') as string;
        const projectDescription = formData.get('projectDescription') as string;

        const intern = await Intern.findById(internId);
        if (!intern) throw new Error('Intern not found');
        
        // A simple way to generate tasks for the new project
        const tasks = [
            { id: 1, title: "Initial research and planning", completed: false },
            { id: 2, title: "Setup project boilerplate", completed: false },
            { id: 3, title: "Develop core feature A", completed: false },
            { id: 4, title: "Develop core feature B", completed: false },
            { id: 5, title: "Write unit tests", completed: false },
            { id: 6, title: "Deploy to staging environment", completed: false },
        ];
        
        const newProject = new Project({
            title: projectName,
            description: projectDescription,
            status: 'In Progress',
            team: [intern.name],
            mentor: intern.mentor,
            document: null,
            recentActivity: 'Project created.',
            tasks: tasks,
            progress: 0,
        });

        await newProject.save();

        // Update intern's project
        intern.project = newProject.title;
        await intern.save();

        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/assign-project');
        revalidatePath(`/dashboard/interns`);
    } catch (error) {
        console.error('Failed to assign project', error);
        throw new Error('Failed to assign project.');
    }
}
