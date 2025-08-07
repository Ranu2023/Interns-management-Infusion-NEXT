
'use server';

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Intern from "@/lib/models/Intern";
import Mentor from "@/lib/models/Mentor";
import User from "@/lib/models/User";
import { ProfileClient } from "./ProfileClient";
import { type User as AuthUser } from "@/context/AuthContext";

async function getProfileData(user: AuthUser) {
    await dbConnect();

    let details = {};

    if (user.role === 'intern') {
        const internProfile = await Intern.findById(user.id).lean();
        details = JSON.parse(JSON.stringify(internProfile));
    } else if (user.role === 'mentor') {
        const mentorProfile = await Mentor.findById(user.id).lean();
        details = JSON.parse(JSON.stringify(mentorProfile));
    } else {
        // For HR, we can just use the base user info from the session
        details = user;
    }

    return details;
}

export default async function ProfilePage() {
    const session = await getSession();
    if (!session?.user) {
        redirect('/');
    }
    
    const user = session.user as AuthUser;
    const profileData = await getProfileData(user);
    
    return (
        <ProfileClient user={user} profileData={profileData} />
    );
}
