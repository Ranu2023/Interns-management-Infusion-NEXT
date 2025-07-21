
'use server';

import { AssignProjectForm } from './AssignProjectForm';
import { getDb } from '@/lib/mongodb';
import { type Intern } from '@/lib/types';

async function getInterns() {
    const db = await getDb();
    const interns = await db.collection<Intern>('interns').find({ status: 'Active' }, { projection: { _id: 0, id: 1, name: 1 } }).toArray();
    return interns;
}

export default async function AssignProjectPage() {
    const interns = await getInterns();

    return <AssignProjectForm interns={interns} />;
}
