
'use server';

import { Suspense } from 'react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, FolderKanban, DollarSign, Loader2, UserCheck } from 'lucide-react';
import { OverviewChart } from '@/components/overview-chart';
import { InternDashboard } from '@/components/intern-dashboard';
import { User } from '@/context/AuthContext';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import Mentor from '@/lib/models/Mentor';
import Project from '@/lib/models/Project';

async function getHRDashboardData() {
    await dbConnect();
    const internCount = await Intern.countDocuments();
    const mentorCount = await Mentor.countDocuments();
    const projectCount = await Project.countDocuments({ status: 'In Progress' });
    const ppoCount = await Intern.countDocuments({ ppoStatus: 'Recommended' });

    return { internCount, mentorCount, projectCount, ppoCount };
}


async function HRDashboard() {
  const { internCount, mentorCount, projectCount, ppoCount } = await getHRDashboardData();

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internCount}</div>
            <p className="text-xs text-muted-foreground">Currently onboarded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorCount}</div>
             <p className="text-xs text-muted-foreground">Available to guide</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PPOs Recommended</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ppoCount}</div>
             <p className="text-xs text-muted-foreground">Based on performance</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <OverviewChart />
      </div>
    </div>
  );
}

function GenericDashboard({ name, role }: { name: string; role: string }) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-headline">Welcome, {name}!</CardTitle>
                    <CardDescription>You are logged in as a {role}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Select an option from the sidebar to get started.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default async function DashboardPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect('/');
    }
    
    const user = session.user as User;

    switch (user.role) {
        case 'hr':
          return <HRDashboard />;
        case 'mentor':
          return <GenericDashboard name={user.name} role="Mentor" />;
        case 'intern':
          return (
            <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <InternDashboard user={user} />
            </Suspense>
          )
        case 'employee':
            return <GenericDashboard name={user.name} role="Employee" />;
        default:
          redirect('/');
    }
}
