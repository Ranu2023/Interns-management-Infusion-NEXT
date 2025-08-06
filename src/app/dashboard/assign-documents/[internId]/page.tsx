
'use server';

import { notFound, redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { getSession } from '@/lib/session';
import Document from '@/lib/models/Document';
import { DocumentAssignmentForm } from './DocumentAssignmentForm';

async function getAssignmentData(internId: string) {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') redirect('/dashboard');

    if (!internId.match(/^[0-9a-fA-F]{24}$/)) notFound();

    await dbConnect();
    const intern = await Intern.findById(internId).lean();
    if (!intern) notFound();

    const existingDocs = await Document.find({ userId: intern._id }).lean();
    const certificate = existingDocs.find(d => d.type === 'Completion Certificate');
    const lor = existingDocs.find(d => d.type === 'LOR');

    return {
        intern: JSON.parse(JSON.stringify(intern)),
        existingCertificateHref: certificate?.href,
        existingLorHref: lor?.href,
    };
}

export default async function AssignSingleDocumentPage({ params }: { params: { internId: string }}) {
    const { intern, existingCertificateHref, existingLorHref } = await getAssignmentData(params.internId);
    
    return <DocumentAssignmentForm 
                intern={intern} 
                existingCertificateHref={existingCertificateHref}
                existingLorHref={existingLorHref}
            />;
}
