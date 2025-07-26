
'use server';

import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import Mentor from '@/lib/models/Mentor';
import { AssignMentorForm } from './AssignMentorForm';

async function getUnassignedData() {
    await dbConnect();
    const interns = await Intern.find({ mentor: 'Unassigned' }).lean();
    const mentors = await Mentor.find({}).lean();
    
    return {
        interns: interns.map(i => ({ ...i, _id: i._id.toString() })),
        mentors: mentors.map(m => ({ ...m, _id: m._id.toString() })),
    }
}

export default async function AssignMentorPage() {
    const { interns, mentors } = await getUnassignedData();

    return (
        <AssignMentorForm interns={interns} mentors={mentors} />
    );
}
