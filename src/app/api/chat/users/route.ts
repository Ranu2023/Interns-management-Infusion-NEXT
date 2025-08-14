
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import Mentor from '@/lib/models/Mentor';
import { User as AuthUser } from '@/context/AuthContext';
import User from '@/lib/models/User';

export async function GET() {
  const session = await getSession();
  const currentUser = session?.user as AuthUser;

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    let chatUsers: any[] = [];

    if (currentUser.role === 'mentor') {
      // Mentor sees their assigned interns
      const interns = await Intern.find({ mentor: currentUser.name }).lean();
      if (interns.length > 0) {
        const internEmails = interns.map(i => i.email);
        chatUsers = await User.find({ email: { $in: internEmails } }, 'name email avatar role').lean();
      }
    } else if (currentUser.role === 'intern') {
      // Intern sees their assigned mentor
      const internProfile = await Intern.findOne({ email: currentUser.email }).lean();
      if (internProfile && internProfile.mentor !== 'Unassigned') {
        const mentor = await Mentor.findOne({ name: internProfile.mentor }).lean();
        if (mentor) {
            const mentorUser = await User.findOne({ email: mentor.email }, 'name email avatar role').lean();
            if(mentorUser) chatUsers.push(mentorUser);
        }
      }
    }
    
    return NextResponse.json(JSON.parse(JSON.stringify(chatUsers)));
  } catch (error) {
    console.error('Failed to fetch chat users', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
