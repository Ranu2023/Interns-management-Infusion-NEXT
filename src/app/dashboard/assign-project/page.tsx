
'use server';

import { AssignProjectForm } from './AssignProjectForm';
import { initialData } from '@/lib/seed-data';

async function getInterns() {
    const activeInterns = initialData.interns.filter(i => i.status === 'Active');
    return activeInterns.map(intern => ({ id: intern.id, name: intern.name }));
}

export default async function AssignProjectPage() {
    const interns = await getInterns();

    return <AssignProjectForm interns={interns} />;
}
