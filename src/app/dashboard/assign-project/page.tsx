
'use server';

import { AssignProjectForm } from './AssignProjectForm';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

async function getMyInternsForProjectAssignment() {
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user.role !== 'mentor') redirect('/dashboard');
    
    await dbConnect();
    // Only get active interns assigned to the current mentor who don't have a project yet
    const interns = await Intern.find({ mentor: user.name, project: 'Unassigned', status: 'Active' }).lean();
    
    // Mongoose returns objects with _id. We convert them to strings for serialization.
    return interns.map(intern => ({...intern, _id: intern._id.toString()}));
}

export default async function AssignProjectPage() {
    const interns = await getMyInternsForProjectAssignment();

    return <AssignProjectForm interns={interns} />;
}
