
'use server';

import { AssignProjectForm } from './AssignProjectForm';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

async function getAllInternsForProjectAssignment() {
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user.role !== 'mentor') redirect('/dashboard');
    
    await dbConnect();
    // Get all interns, not just unassigned ones for the current mentor.
    const interns = await Intern.find({}).lean();
    
    // Mongoose returns objects with _id. We convert them to strings for serialization.
    return interns.map(intern => ({...intern, _id: intern._id.toString()}));
}

export default async function AssignProjectPage() {
    const interns = await getAllInternsForProjectAssignment();

    return <AssignProjectForm interns={interns} />;
}
