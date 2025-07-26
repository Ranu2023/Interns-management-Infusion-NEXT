
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from './db';
import Project from './models/Project';
import Application from './models/Application';
import Intern from './models/Intern';
import DailyReport from './models/DailyReport';
import User from './models/User';
import Mentor from './models/Mentor';
import Notification from './models/Notification';
import MentorshipRequest from './models/MentorshipRequest';
import { type Task } from './types';
import { type IProject } from './models/Project';
import bcrypt from 'bcryptjs';
import { encrypt, getSession } from './session';
import { redirect } from 'next/navigation';
import { Role, User as SessionUser } from '@/context/AuthContext';
import { cookies } from 'next/headers';

// ✅ User Registration
export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as Role;

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

        // 1. Create the main user for authentication
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            avatar: `https://placehold.co/100x100.png`
        });
        await newUser.save();

        // 2. Create the role-specific profile
        if (role === 'intern') {
            const newIntern = new Intern({
                _id: newUser._id, // Use same ID for linking
                name,
                email,
                project: 'Unassigned',
                mentor: 'Unassigned',
                status: 'Active',
                ppoStatus: 'Pending',
                ppoDecision: 'Pending',
            });
            await newIntern.save();
        } else if (role === 'mentor') {
            const newMentor = new Mentor({
                 _id: newUser._id, // Use same ID for linking
                name,
                email,
                expertise: 'General',
                interns: 0,
                avatar: `https://placehold.co/100x100.png`,
            });
            await newMentor.save();
        }
        
        return { success: true, message: 'Registration successful! You can now log in.' };

    } catch (error) {
        console.error('Registration failed:', error);
        return { success: false, message: 'An internal server error occurred.' };
    }
}


// ✅ User Authentication
export async function authenticate(prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as Role;

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: 'Invalid credentials.' };
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return { success: false, message: 'Invalid credentials.' };
        }

        if (user.role !== role) {
             return { success: false, message: `Incorrect role selected. This user is a ${user.role}.` };
        }

        const sessionUser: SessionUser = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        };

        const session = await encrypt({ user: sessionUser });

        cookies().set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60, // 1 hour
        });
        
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.name === 'CredentialsSignin') {
            return { success: false, message: error.message };
        }
        return { success: false, message: 'An internal server error occurred.' };
    }
    redirect('/dashboard');
}

// ✅ Task Update
export async function updateTaskCompletion(projectId: string, taskId: number, completed: boolean) {
    try {
        await dbConnect();
        const project = await Project.findById(projectId);
        if (!project) throw new Error('Project not found');

        const task = project.tasks.find((t: Task) => t.id === taskId);
        if (task) task.completed = completed;

        const completedTasks = project.tasks.filter((t: Task) => t.completed).length;
        project.progress = (completedTasks / project.tasks.length) * 100;
        project.status = project.progress === 100 ? 'Completed' : 'In Progress';
        project.recentActivity = `Task "${task?.title}" marked as ${completed ? 'complete' : 'incomplete'}.`

        await project.save();

        revalidatePath(`/dashboard/my-projects/${projectId}`);
        revalidatePath('/dashboard/my-projects');
        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/my-interns');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Failed to update task:', error);
        return { success: false, message: 'Failed to update task.' };
    }
}

// ✅ Application Status Update
export async function updateApplicationStatus(applicationId: string, status: 'Accepted' | 'Rejected') {
    await dbConnect();
    const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!application) throw new Error('Application not found');

    if (status === 'Accepted') {
        const email = `${application.name.split(' ').join('.').toLowerCase()}@synergy.com`;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const tempPassword = "password" 
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            
            const newUser = new User({
                name: application.name,
                email,
                password: hashedPassword,
                role: 'intern',
                avatar: `https://placehold.co/100x100.png`
            });
            await newUser.save();

            const newIntern = new Intern({
                 _id: newUser._id,
                name: application.name,
                email: email,
                project: 'Unassigned',
                mentor: 'Unassigned',
                status: 'Active',
                ppoStatus: 'Pending',
                ppoDecision: 'Pending',
            });
            await newIntern.save();
        }
        revalidatePath('/dashboard/interns');
    }

    revalidatePath(`/dashboard/applications`);
    revalidatePath(`/dashboard/applications/${applicationId}`);
}

// ✅ Assign Project
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
        if (!intern) return { success: false, message: 'Intern not found.' };

        const session = await getSession();
        if (!session?.user || session.user.name !== intern.mentor) {
            return { success: false, message: 'You can only assign projects to your own interns.' };
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
            tasks,
            progress: 0,
        });

        await newProject.save();
        intern.project = newProject.title;
        await intern.save();

        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/mentor-projects');
        revalidatePath('/dashboard/assign-project');
        revalidatePath(`/dashboard/interns`);
        revalidatePath(`/dashboard/intern/${internId}`);

        return { success: true, message: 'Project assigned successfully' };
    } catch (error) {
        console.error('Failed to assign project', error);
        return { success: false, message: 'An internal error occurred.' };
    }
}

// ✅ Submit Daily Report
export async function submitDailyReport(formData: FormData) {
    const accomplishments = formData.get('accomplishments');
    const goals = formData.get('goals');
    const blockers = formData.get('blockers');

    const session = await getSession();
    if (!session?.user) return { success: false, message: "Authentication required." };

    const intern = await Intern.findOne({ email: session.user.email });
    if (!intern) return { success: false, message: "Intern profile not found." };

    if (!accomplishments || !goals) {
        return { success: false, message: "Please fill out yesterday's accomplishments and today's goals." };
    }

    try {
        await dbConnect();
        const report = new DailyReport({
            internId: intern._id,
            date: new Date(),
            accomplishments,
            goals,
            blockers
        });
        await report.save();

        revalidatePath('/dashboard/daily-report');
        return { success: true, message: 'Report submitted successfully' };

    } catch (error) {
        console.error('Failed to submit report', error);
        return { success: false, message: 'Failed to submit report.' };
    }
}

// ✅ Get My Daily Reports (for the logged-in intern)
export async function getMyDailyReports() {
    const session = await getSession();
    if (!session?.user) return [];

    try {
        await dbConnect();
        const intern = await Intern.findOne({ email: session.user.email });
        if (!intern) return [];

        const reports = await DailyReport.find({ internId: intern._id }).sort({ date: -1 }).lean();
        return JSON.parse(JSON.stringify(reports));

    } catch (error) {
        console.error('Failed to fetch reports', error);
        return [];
    }
}


// ✅ Save PPO Assessment
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

        if (!intern) return { success: false, message: 'Intern not found' };

        revalidatePath(`/dashboard/intern/${internId}`);
        revalidatePath('/dashboard/ppo-status');

        return { success: true, message: 'Assessment saved successfully!' };
    } catch (error) {
        console.error('Failed to save assessment', error);
        return { success: false, message: 'Failed to save assessment.' };
    }
}

// ✅ Update PPO Decision
export async function updatePPODecision(internId: string, decision: 'Accepted' | 'Rejected') {
    try {
        await dbConnect();
        const intern = await Intern.findByIdAndUpdate(internId, {
            ppoDecision: decision,
            status: 'Completed'
        }, { new: true });

        if (!intern) return { success: false, message: 'Intern not found' };

        revalidatePath('/dashboard/ppo-status');
        revalidatePath(`/dashboard/intern/${internId}`);
        revalidatePath('/dashboard/interns');

        return { success: true, message: `PPO decision updated to ${decision}` };
    } catch (error) {
        console.error('Failed to update PPO decision', error);
        return { success: false, message: 'Failed to update PPO decision.' };
    }
}

// ✅ Assign Mentor
export async function assignMentor(formData: FormData) {
    const internId = formData.get('internId') as string;
    const mentorId = formData.get('mentorId') as string;

    if (!internId || !mentorId) {
        return { success: false, message: 'Please select both an intern and a mentor.' };
    }

    try {
        await dbConnect();
        const intern = await Intern.findById(internId);
        const mentor = await Mentor.findById(mentorId);

        if (!intern || !mentor) {
            return { success: false, message: 'Intern or Mentor not found.' };
        }

        intern.mentor = mentor.name;
        await intern.save();

        mentor.interns += 1;
        await mentor.save();
        
        // Use the IDs from the found documents, which are guaranteed to be correct.
        const userForIntern = await User.findById(intern._id);
        const userForMentor = await User.findById(mentor._id);

        if (userForIntern) {
            await new Notification({
                userId: userForIntern._id,
                message: `You have been assigned to a new mentor: ${mentor.name}.`,
                href: `/dashboard/my-interns`
            }).save();
        }
        if (userForMentor) {
            await new Notification({
                userId: userForMentor._id,
                message: `You have been assigned a new intern: ${intern.name}.`,
                href: `/dashboard/my-interns`
            }).save();
        }

        revalidatePath('/dashboard/assign-mentor');
        revalidatePath('/dashboard/interns');
        revalidatePath('/dashboard/mentors');
        revalidatePath('/dashboard/my-interns');

        return { success: true, message: `${intern.name} has been assigned to ${mentor.name}.` };
    } catch (error) {
        console.error('Failed to assign mentor:', error);
        return { success: false, message: 'An internal error occurred.' };
    }
}

// ✅ Request Premium Mentorship
export async function requestMentorship(mentorId: string) {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'intern') {
        return { success: false, message: 'Only interns can request mentorship.' };
    }

    try {
        await dbConnect();
        
        const existingRequest = await MentorshipRequest.findOne({ intern: session.user.id, mentor: mentorId });
        if (existingRequest) {
            return { success: false, message: 'You have already sent a request to this mentor.' };
        }

        const mentorshipRequest = new MentorshipRequest({
            intern: session.user.id,
            mentor: mentorId,
            status: 'Pending',
        });
        await mentorshipRequest.save();

        const mentorUser = await User.findById(mentorId);
        if (mentorUser) {
            await new Notification({
                userId: mentorUser._id,
                message: `${session.user.name} has requested premium mentorship.`,
                href: '/dashboard/mentorship'
            }).save();
        }


        revalidatePath('/dashboard/mentorship');
        return { success: true, message: `Your request to the mentor has been sent.` };
    } catch (error) {
        console.error('Failed to request mentorship:', error);
        return { success: false, message: 'An internal error occurred.' };
    }
}

// ✅ Update Mentorship Request Status
export async function updateMentorshipRequest(requestId: string, status: 'Accepted' | 'Rejected') {
     const session = await getSession();
    if (!session?.user || session.user.role !== 'mentor') {
        return { success: false, message: 'Only mentors can update requests.' };
    }
    try {
        await dbConnect();
        const request = await MentorshipRequest.findById(requestId).populate('intern').populate('mentor');
        if (!request) {
            return { success: false, message: 'Request not found.' };
        }
        
        // Ensure the logged-in mentor is the one the request was sent to
        if (request.mentor._id.toString() !== session.user.id) {
             return { success: false, message: 'You are not authorized to update this request.' };
        }
        
        request.status = status;
        await request.save();

        const userForIntern = await User.findById(request.intern._id);

        if (userForIntern) {
            await new Notification({
                userId: userForIntern._id,
                message: `Your mentorship request with ${request.mentor.name} has been ${status}.`,
                href: '/dashboard/my-mentorship'
            }).save();
        }
        
        revalidatePath('/dashboard/mentorship');
        revalidatePath('/dashboard/my-mentorship');
        return { success: true, message: `Request has been ${status}.` };
    } catch (error) {
        console.error('Failed to update request:', error);
        return { success: false, message: 'An internal error occurred.' };
    }
}


export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/');
}
