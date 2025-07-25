
'use server';

import { Suspense } from 'react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, FolderKanban, DollarSign } from 'lucide-react';
import { OverviewChart } from '@/components/overview-chart';
import { initialData } from '@/lib/seed-data';
import { InternDashboard } from '@/components/intern-dashboard';
import { User } from '@/context/AuthContext';


function HRDashboard() {
  const internCount = initialData.interns.length;
  const ppoCount = initialData.interns.filter(i => i.ppoStatus === 'Recommended').length;
  const projectCount = initialData.projects.filter(p => p.status === 'In Progress').length;

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
            <p className="text-xs text-muted-foreground">+10 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PPOs Issued</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ppoCount}</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount}</div>
            <p className="text-xs text-muted-foreground">+8 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stipend Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-xs text-muted-foreground">For this month</p>
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

    