
'use server';

import { AssignProjectForm } from './AssignProjectForm';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { initialData } from '@/lib/seed-data';

async function getInterns() {
    await dbConnect();
    // Only get active interns who can be assigned a project
    let interns = await Intern.find({ status: 'Active' }).lean();

    if (!interns || interns.length === 0) {
        // Seed data if collection is empty
        await Intern.insertMany(initialData.interns);
        interns = await Intern.find({ status: 'Active' }).lean();
    }
    
    // Mongoose returns objects with _id. We convert them to strings for serialization.
    return interns.map(intern => ({...intern, _id: intern._id.toString()}));
}

export default async function AssignProjectPage() {
    const interns = await getInterns();

    return <AssignProjectForm interns={interns} />;
}
