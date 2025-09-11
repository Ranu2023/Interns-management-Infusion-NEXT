
'use server';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, FileText, CheckCircle2, ListTodo, AlertTriangle } from 'lucide-react';
import type { User } from '@/context/AuthContext';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import Project from '@/lib/models/Project';
import type { IProject } from '@/lib/models/Project';
import type { IIntern } from '@/lib/models/Intern';


async function getDashboardData(user: User): Promise<{
  intern: (IIntern & { _id: string}) | null;
  project: (IProject & { _id: string }) | null;
  tasksCompleted: number;
  tasksTotal: number;
}> {
  await dbConnect();
  
  if (!user || !user.email) {
    return { intern: null, project: null, tasksCompleted: 0, tasksTotal: 0 };
  }

  const intern = await Intern.findOne({ email: user.email }).lean();
  
  if (!intern) {
    return { intern: null, project: null, tasksCompleted: 0, tasksTotal: 0 };
  }
  
  const plainIntern = JSON.parse(JSON.stringify(intern));

  // If intern's project is unassigned, don't try to fetch a project.
  if (!intern.project || intern.project === 'Unassigned') {
    return { intern: plainIntern, project: null, tasksCompleted: 0, tasksTotal: 0 };
  }

  const projectData = await Project.findOne({ title: intern.project }).lean();

  let tasksCompleted = 0;
  let tasksTotal = 0;
  let project: (IProject & { _id: string }) | null = null;

  if (projectData) {
    tasksCompleted = projectData.tasks.filter((t) => t.completed).length;
    tasksTotal = projectData.tasks.length;
    project = {
        ...projectData,
        _id: projectData._id.toString()
    }
  }
  
  return {
    intern: plainIntern,
    project: project ? JSON.parse(JSON.stringify(project)) : null,
    tasksCompleted,
    tasksTotal,
  };
}

export async function InternDashboard({ user }: { user: User }) {
  if (!user || !user.name) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive-foreground">Invalid user session.</p>
        </CardContent>
      </Card>
    );
  }

  const { intern, project, tasksCompleted, tasksTotal } =
    await getDashboardData(user);

    if (!intern) {
        return (
             <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Could not load intern data. Please contact support.</p>
                </CardContent>
            </Card>
        )
    }

    if (intern.activeStatus === 'inactive') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive h-6 w-6" />
                        Account Inactive
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-lg text-muted-foreground">
                        Your account is currently inactive. Please send "confirm mail" to activate your dashboard. Contact HR for more details.
                    </p>
                </CardContent>
            </Card>
        );
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your internship progress.
        </p>
      </div>

      {project ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Project: {project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <p className="text-muted-foreground">Overall Progress</p>
                <span>{project.progress || 0}%</span>
              </div>
              <Progress value={project.progress || 0} />
            </div>
            <div className="flex justify-around text-center text-sm border-t border-b py-4">
              <div>
                <CheckCircle2 className="h-6 w-6 mx-auto text-primary mb-1" />
                <p className="font-semibold">{tasksCompleted}</p>
                <p className="text-xs text-muted-foreground">Tasks Done</p>
              </div>
              <div>
                <ListTodo className="h-6 w-6 mx-auto text-primary mb-1" />
                <p className="font-semibold">{tasksTotal}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row items-center gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/dashboard/my-projects/${project._id}`}>
                View Project Details <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard/daily-report">
                <FileText className="mr-2" /> Submit Daily Report
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <p className="text-lg font-semibold">No Project Assigned Yet</p>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Welcome to Infusion! It looks like you haven't been assigned to a project.
                Your mentor will assign one to you soon. Please check back later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    