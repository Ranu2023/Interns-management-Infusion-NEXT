
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from './db';
import Project from './models/Project';
import Application from './models/Application';
import Intern from './models/Intern';
import DailyReport from './models/DailyReport';

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
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import MentorshipSession from './models/MentorshipSession';
import DocumentModel, { DocumentType } from './models/Document';




export async function logout() {
    cookies().set('session', '', { expires: new Date(0) });
    redirect('/');
  }
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
                avatar: `https://placehold.co/100x100.png`,
            });
            await newIntern.save();
        } else if (role === 'mentor') {
            const newMentor = new Mentor({
                 _id: newUser._id, // Use same ID for linking
                name,
                email,
                expertise: 'General', // Default value
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
        
        // Fetch role-specific details to add to session
        let roleDetails = {};
        if(role === 'mentor') {
            const mentorProfile = await Mentor.findById(user._id).lean();
            if(mentorProfile) roleDetails = { expertise: mentorProfile.expertise };
        }

        const sessionUser: SessionUser = {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            ...roleDetails
        };

        const session = await encrypt({ user: sessionUser });

        cookies().set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
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
                avatar: `https://placehold.co/100x100.png`,
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
    const projectTasks = formData.get('projectTasks') as string;


    if (!internId || !projectName || !projectDescription || !projectTasks) {
        return { success: false, message: 'Missing required fields. Project Name, Description and Tasks are required.' };
    }

    try {
        await dbConnect();
        const intern = await Intern.findById(internId);
        if (!intern) return { success: false, message: 'Intern not found.' };

        const session = await getSession();
        if (!session?.user || session.user.name !== intern.mentor) {
            return { success: false, message: 'You can only assign projects to your own interns.' };
        }

        const tasks: Task[] = projectTasks
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((line, index) => ({
                id: index + 1,
                title: line.trim(),
                completed: false,
            }));

        if(tasks.length === 0) {
            return { success: false, message: 'Please provide at least one task.' };
        }

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
    const projectId = formData.get('projectId') as string;
    const progressNote = formData.get('progressNote') as string;
    const blockers = formData.get('blockers') as string;
    const completedTasks = formData.getAll('completedTasks') as string[];
    
    const session = await getSession();
    if (!session?.user) return { success: false, message: "Authentication required." };

    const intern = await Intern.findOne({ email: session.user.email });
    if (!intern) return { success: false, message: "Intern profile not found." };
    if (!intern.mentor || intern.mentor === 'Unassigned') return { success: false, message: "You must have a mentor assigned to submit reports."}
    
    if (!projectId || !progressNote) {
        return { success: false, message: "Please select a project and provide a progress note." };
    }

    try {
        await dbConnect();

        const project = await Project.findById(projectId);
        if (!project) return { success: false, message: 'Project not found' };

        const mentor = await Mentor.findOne({ name: intern.mentor });
        if (!mentor) return { success: false, message: 'Mentor not found' };

        const report = new DailyReport({
            internId: intern._id,
            mentorId: mentor._id,
            projectId: project._id,
            projectName: project.title,
            date: new Date(),
            progressNote,
            blockers,
            completedTasks
        });
        await report.save();

        revalidatePath('/dashboard/daily-report');
        revalidatePath('/dashboard/reports'); // For mentor
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

export async function submitMentorFeedback(prevState: any, formData: FormData) {
    const reportId = formData.get('reportId') as string;
    const status = formData.get('status') as 'Approved' | 'Rejected' | 'Changes-Required';
    const comments = formData.get('comments') as string;
    
    if(!reportId || !status) return { success: false, message: "Missing required fields." };
    if(status === 'Changes-Required' && !comments) return { success: false, message: "Comments are required when requesting changes." };

    try {
        await dbConnect();
        const report = await DailyReport.findById(reportId);
        if(!report) return { success: false, message: "Report not found." };
        
        report.mentorFeedback = {
            status,
            comments: comments || undefined,
            date: new Date(),
        };
        
        await report.save();

        // If approved, update project tasks
        if (status === 'Approved' && report.completedTasks.length > 0) {
            const project = await Project.findById(report.projectId);
            if (project) {
                let tasksUpdated = false;
                report.completedTasks.forEach((taskId: string) => {
                    const task = project.tasks.find((t: Task) => t.id === parseInt(taskId, 10));
                    if (task && !task.completed) {
                        task.completed = true;
                        tasksUpdated = true;
                    }
                });

                if (tasksUpdated) {
                     const completedCount = project.tasks.filter((t: Task) => t.completed).length;
                     project.progress = Math.round((completedCount / project.tasks.length) * 100);
                     if (project.progress === 100) {
                         project.status = 'Completed';
                     }
                     await project.save();
                }
            }
        }


        revalidatePath(`/dashboard/reports/${reportId}`);
        revalidatePath('/dashboard/reports');
        revalidatePath('/dashboard/my-feedback');
        revalidatePath('/dashboard/my-projects');
        revalidatePath(`/dashboard/my-projects/${report.projectId.toString()}`);
        revalidatePath('/dashboard');

        return { success: true, message: "Feedback submitted successfully." };

    } catch (error) {
        console.error('Failed to submit feedback:', error);
        return { success: false, message: "An internal error occurred." };
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
        
        const internUser = await User.findById(intern._id).lean();
        const mentorUser = await User.findById(mentor._id).lean();

        if (internUser) {
            await new Notification({
                userId: internUser._id,
                message: `You have been assigned to a new mentor: ${mentor.name}.`,
                href: `/dashboard/my-interns`
            }).save();
        }
        if (mentorUser) {
            await new Notification({
                userId: mentorUser._id,
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

export async function requestMentorship(mentorId: string) {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'intern') {
      return { success: false, message: 'Only interns can request mentorship.' };
    }
  
    try {
        await dbConnect();
      
        const intern = await Intern.findOne({ email: session.user.email }).lean();
        if (!intern) {
            return { success: false, message: 'Intern profile not found.' };
        }
        const internId = intern._id;
  
        const existingRequest = await MentorshipRequest.findOne({
            intern: new mongoose.Types.ObjectId(internId),
            mentor: new mongoose.Types.ObjectId(mentorId),
            status: 'pending',
        });
  
        if (existingRequest) {
            return { success: false, message: 'You already have a pending request to this mentor.' };
        }
  
        await MentorshipRequest.create({
            intern: new mongoose.Types.ObjectId(internId),
            mentor: new mongoose.Types.ObjectId(mentorId),
        });
  
        const mentor = await Mentor.findById(mentorId).lean();
        if (mentor) {
            await new Notification({
                userId: mentor._id,
                message: `${session.user.name} has requested mentorship.`,
                href: '/dashboard/mentorship',
            }).save();
        }
  
        revalidatePath('/dashboard/my-mentorship');
        return { success: true, message: `Your request has been sent.` };
    } catch (error) {
      console.error('Failed to request mentorship:', error);
      return { success: false, message: 'An internal error occurred.' };
    }
}
  

export async function addMessageToSession(sessionId: string, formData: FormData) {
    const session = await getSession();
    if (!session?.user) {
        return { success: false, message: 'Authentication required.' };
    }

    const message = formData.get('message') as string;
    if (!message || message.trim() === '') {
        return { success: false, message: 'Message cannot be empty.' };
    }

    try {
        await dbConnect();
        
        const mentorshipSession = await MentorshipSession.findById(sessionId);
        if (!mentorshipSession) {
            return { success: false, message: 'Session not found.' };
        }

        // Security check
        const isParticipant =
            mentorshipSession.intern.toString() === session.user.id ||
            mentorshipSession.mentor.toString() === session.user.id;
        
        if (!isParticipant) {
            return { success: false, message: 'Unauthorized.' };
        }

        mentorshipSession.chat.push({
            senderId: new mongoose.Types.ObjectId(session.user.id),
            message: message,
            timestamp: new Date()
        });

        await mentorshipSession.save();

        revalidatePath(`/dashboard/mentorship/${sessionId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to send message:', error);
        return { success: false, message: 'Failed to send message.' };
    }
}


export async function updateMentorshipRequest(requestId: string, status: 'approved' | 'rejected') {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'mentor') {
        return { success: false, message: 'Unauthorized: Only mentors can update requests.' };
    }

    try {
        await dbConnect();
        
        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return { success: false, message: 'Request not found.' };
        }

        const mentor = await Mentor.findById(request.mentor);
        if (mentor?.email !== session.user.email) {
             return { success: false, message: 'You are not authorized to update this request.' };
        }

        request.status = status;
        
        if (status === 'approved') {
            const newSession = await MentorshipSession.create({
                intern: request.intern,
                mentor: request.mentor,
                chat: [{
                    senderId: request.mentor,
                    message: `Hello! I've accepted your mentorship request. How can I help you get started?`
                }]
            });
            request.sessionId = newSession._id;
        }

        await request.save();
        
        // Find the intern's user account to send a notification
        const internProfile = await Intern.findById(request.intern).lean();
        if (internProfile) {
            await new Notification({
                userId: internProfile._id,
                message: `Your mentorship request with ${session.user.name} has been ${status}.`,
                href: '/dashboard/my-mentorship',
            }).save();
        }
        
        revalidatePath('/dashboard/mentorship');
        revalidatePath('/dashboard/my-mentorship'); 

        return { success: true, message: `Request has been ${status}.` };
    } catch (error: any) {
        console.error('Failed to update request:', error);
        return { success: false, message: error.message || 'An internal server error occurred.' };
    }
}


export async function assignDocuments(internId: string, prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') {
        return { success: false, message: 'Unauthorized: Only HR can assign documents.' };
    }

    const certificateLink = formData.get('certificateLink') as string;
    const lorLink = formData.get('lorLink') as string;

    if (!certificateLink || !lorLink) {
        return { success: false, message: 'Both document links are required.' };
    }
    
    try {
        await dbConnect();

        const intern = await Intern.findById(internId);
        if(!intern) {
             return { success: false, message: 'Intern not found.' };
        }
        
        const documentsToCreate: { userId: string, name: string, type: DocumentType, href: string }[] = [];

        if (certificateLink) {
            documentsToCreate.push({
                userId: intern._id,
                name: 'Internship Completion Certificate',
                type: 'Completion Certificate',
                href: certificateLink,
            });
        }
        if (lorLink) {
            documentsToCreate.push({
                userId: intern._id,
                name: 'Letter of Recommendation',
                type: 'LOR',
                href: lorLink,
            });
        }

        // Use bulk operations to avoid multiple DB calls
        await DocumentModel.insertMany(documentsToCreate);
        
        // Notify the intern
        await new Notification({
            userId: intern._id,
            message: `New documents have been assigned to you by HR.`,
            href: '/dashboard/documents',
        }).save();

        revalidatePath('/dashboard/documents');
        revalidatePath(`/dashboard/assign-documents/${internId}`);
        revalidatePath('/dashboard/assign-documents');

        return { success: true, message: 'Documents assigned successfully!' };

    } catch (error) {
        console.error('Failed to assign documents:', error);
        return { success: false, message: 'An internal server error occurred.' };
    }
}