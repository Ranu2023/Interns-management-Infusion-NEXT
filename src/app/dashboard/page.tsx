
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
import { ProjectStatusChart } from '@/components/project-status-chart';

async function getHRDashboardData() {
    await dbConnect();
    const internCount = await Intern.countDocuments();
    const mentorCount = await Mentor.countDocuments();
    const projectCount = await Project.countDocuments({ status: 'In Progress' });
    const ppoCount = await Intern.countDocuments({ ppoStatus: 'Recommended' });

    // PPO Trends Data Aggregation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const ppoData = await Intern.aggregate([
        { 
            $match: { 
                finalDecisionDate: { $gte: sixMonthsAgo },
                ppoStatus: { $in: ['Recommended', 'Not Recommended'] }
            } 
        },
        {
            $group: {
                _id: { 
                    year: { $year: "$finalDecisionDate" }, 
                    month: { $month: "$finalDecisionDate" },
                    status: "$ppoStatus"
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: { year: "$_id.year", month: "$_id.month" },
                statuses: { $push: { status: "$_id.status", count: "$count" } }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const ppoChartData = ppoData.map(d => {
        const recommended = d.statuses.find((s:any) => s.status === 'Recommended')?.count || 0;
        const notRecommended = d.statuses.find((s:any) => s.status === 'Not Recommended')?.count || 0;
        return {
            name: `${monthNames[d._id.month - 1]} ${d._id.year.toString().slice(-2)}`,
            'PPOs Offered': recommended,
            'PPOs Rejected': notRecommended,
        }
    });

    // Project Status Data Aggregation
    const projectStatusData = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const projectChartData = projectStatusData.map(item => ({
        status: item._id,
        value: item.count,
    }));


    return { internCount, mentorCount, projectCount, ppoCount, ppoChartData, projectChartData };
}


async function HRDashboard() {
  const { internCount, mentorCount, projectCount, ppoCount, ppoChartData, projectChartData } = await getHRDashboardData();

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
      <div className="grid gap-6 md:grid-cols-2">
        <OverviewChart data={ppoChartData} />
        <ProjectStatusChart data={projectChartData} />
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
