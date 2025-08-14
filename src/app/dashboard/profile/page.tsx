
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

    let details: any = {};

    if (user.role === 'intern') {
        details = await Intern.findById(user.id).lean();
    } else if (user.role === 'mentor') {
        details = await Mentor.findById(user.id).lean();
    } else if (user.role === 'hr') {
        details = await User.findById(user.id).lean();
    }
    
    // Fallback for user details if specific role profile not found
    if (!details) {
        details = await User.findById(user.id).lean();
    }


    return JSON.parse(JSON.stringify(details || user));
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
