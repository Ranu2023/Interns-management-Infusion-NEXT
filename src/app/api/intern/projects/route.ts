import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import Project from '@/lib/models/Project';

export async function GET() {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'intern') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const intern = await Intern.findOne({ email: session.user.email }).lean();
        if (!intern) {
            return NextResponse.json({ error: 'Intern not found' }, { status: 404 });
        }

        const projects = await Project.find({ team: intern.name }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(projects)));
        
    } catch (error) {
        console.error('Failed to fetch intern projects', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
