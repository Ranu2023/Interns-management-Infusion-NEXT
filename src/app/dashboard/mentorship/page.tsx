
'use server';

import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { InternMentorshipHub } from './InternMentorshipHub';
import { MentorMentorshipRequests } from './MentorMentorshipRequests';

export default async function MentorshipPage() {
    const session = await getSession();
    const user = session?.user as User;

    if (user?.role === 'intern') {
        return <InternMentorshipHub />;
    }
    
    if (user?.role === 'mentor') {
        return <MentorMentorshipRequests mentorId={user.id} />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">This page is only available to interns and mentors.</p>
        </div>
    );
}
