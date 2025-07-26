
'use server';

import { AssignProjectForm } from './AssignProjectForm';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';

async function getInterns() {
    await dbConnect();
    // Only get active interns who can be assigned a project
    // On-the-fly seeding is removed.
    let interns = await Intern.find({ status: 'Active' }).lean();
    
    // Mongoose returns objects with _id. We convert them to strings for serialization.
    return interns.map(intern => ({...intern, _id: intern._id.toString()}));
}

export default async function AssignProjectPage() {
    const interns = await getInterns();

    return <AssignProjectForm interns={interns} />;
}
