'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from './db';
import Project from './models/Project';
import Application from './models/Application';
import Intern from './models/Intern';
import DailyReport from './models/DailyReport';
import User from './models/User';
import { type Task } from './types';
import { type IProject } from './models/Project';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt } from './session';


export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!name || !email || !password || !role) {
        return { success: false, message: 'All fields are required.' };
    }

    try {
        await dbConnect();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: 'User with this email already exists.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            avatar: `https://placehold.co/100x100.png`
        });

        await newUser.save();
        revalidatePath('/register');
        return { success: true, message: 'Registration successful! Please log in.' };

    } catch (error) {
        console.error('Registration failed:', error);
        return { success: false, message: 'An internal error occurred.' };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await dbConnect();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await User.findOne({ email });
    if (!user) return 'CredentialsSignin';

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) return 'CredentialsSignin';
    
    const sessionUser = { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        avatar: user.avatar,
    };
    
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: sessionUser, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });

    revalidatePath('/dashboard');

  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
        return 'CredentialsSignin';
    }
    console.error(error);
    return 'An unexpected error occurred.';
  }
}

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
    project.recentActivity = `Task "${task?.title}" marked as ${completed ? 'complete' : 'incomplete'}.`

    await project.save();

    revalidatePath(`/dashboard/my-projects/${projectId}`);
    revalidatePath('/dashboard/my-projects');
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard/my-interns');

    return { success: true };
  } catch (error) {
    console.error('Failed to update task:', error);
    // Return a serializable error object
    return { success: false, message: 'Failed to update task.' };
  }
}

export async function updateApplicationStatus(applicationId: string, status: 'Accepted' | 'Rejected') {
    await dbConnect();
    const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!application) {
        throw new Error('Application not found');
    }
    
    // If accepted, create a new Intern record
    if (status === 'Accepted') {
        const email = `${application.name.split(' ').join('.').toLowerCase()}@synergy.com`
        const existingIntern = await Intern.findOne({ email });
        if (!existingIntern) {
            const newIntern = new Intern({
                name: application.name,
                email: email,
                project: 'Unassigned',
                mentor: 'Unassigned', // or assign a default mentor
                status: 'Active',
                ppoStatus: 'Pending'
            });
            await newIntern.save();
            revalidatePath('/dashboard/interns');
        }
    }

    revalidatePath(`/dashboard/applications`);
    revalidatePath(`/dashboard/applications/${applicationId}`);
}

export async function assignProject(formData: FormData) {
    const internId = formData.get('internId') as string;
    const projectName = formData.get('projectName') as string;
    const projectDescription = formData.get('projectDescription') as string;
    const documentLink = formData.get('documentLink') as string | null;

    if (!internId || !projectName || !projectDescription) {
        return { success: false, message: 'Missing required fields.' };
    }

    try {
        await dbConnect();

        const intern = await Intern.findById(internId);
        if (!intern) {
             return { success: false, message: 'Intern not found.' };
        }
        
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
            document: documentLink,
            recentActivity: 'Project created.',
            tasks: tasks,
            progress: 0,
        });

        await newProject.save();

        intern.project = newProject.title;
        await intern.save();

        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/assign-project');
        revalidatePath(`/dashboard/interns`);
        revalidatePath(`/dashboard/intern/${internId}`);

        return { success: true, message: 'Project assigned successfully' };
    } catch (error) {
        console.error('Failed to assign project', error);
        return { success: false, message: 'An internal error occurred.' };
    }
}

export async function submitDailyReport(formData: FormData) {
    const accomplishments = formData.get('accomplishments');
    const goals = formData.get('goals');
    const blockers = formData.get('blockers');
    // In a real app, you'd get the internId from the session/auth
    const internId = "669a8e5a5b5e3c8b4b7a1b1a"; 

    if (!accomplishments || !goals) {
        return { success: false, message: "Please fill out yesterday's accomplishments and today's goals."}
    }

    try {
        await dbConnect();
        const report = new DailyReport({
            internId,
            date: new Date(),
            accomplishments,
            goals,
            blockers
        });
        await report.save();
        
        revalidatePath('/dashboard/daily-report');
        return { success: true, message: 'Report submitted successfully' };

    } catch(error) {
        console.error('Failed to submit report', error);
        return { success: false, message: 'Failed to submit report.'}
    }
}

export async function savePPOAssessment(internId: string, formData: FormData) {
    const assessmentScore = formData.get('assessmentScore');
    const ppoStatus = formData.get('ppoStatus');
    const ppoReasoning = formData.get('ppoReasoning');

    try {
        await dbConnect();
        const intern = await Intern.findByIdAndUpdate(internId, {
            assessmentScore: Number(assessmentScore),
            ppoStatus,
            ppoReasoning
        }, { new: true });

        if (!intern) {
            return { success: false, message: 'Intern not found' };
        }
        revalidatePath(`/dashboard/intern/${internId}`);
        revalidatePath('/dashboard/ppo-status');
        
        return { success: true, message: 'Assessment saved successfully!' };
    } catch (error) {
        console.error('Failed to save assessment', error);
        return { success: false, message: 'Failed to save assessment.' };
    }
}

export async function updatePPODecision(internId: string, decision: 'Accepted' | 'Rejected') {
    try {
        await dbConnect();
        const intern = await Intern.findByIdAndUpdate(internId, {
            ppoDecision: decision,
            status: decision === 'Accepted' ? 'Completed' : 'Completed' // Or some other status
        }, { new: true });

        if (!intern) {
            return { success: false, message: 'Intern not found' };
        }

        revalidatePath('/dashboard/ppo-status');
        revalidatePath(`/dashboard/intern/${internId}`);
        revalidatePath('/dashboard/interns');

        return { success: true, message: `PPO decision updated to ${decision}` };
    } catch (error) {
        console.error('Failed to update PPO decision', error);
        return { success: false, message: 'Failed to update PPO decision.' };
    }
}
