
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, FolderKanban, DollarSign } from 'lucide-react';
import { OverviewChart } from '@/components/overview-chart';
import { getDb } from '@/lib/mongodb';
import { Suspense } from 'react';

// Server component to fetch data for HR
async function HRDashboardData() {
  const db = await getDb();
  const internCount = await db.collection('interns').countDocuments();
  const ppoCount = await db.collection('interns').countDocuments({ ppoStatus: 'Recommended' });
  const projectCount = await db.collection('projects').countDocuments({ status: 'In Progress' });

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

// This client component wraps the logic to decide which dashboard to show
// based on the user's role from the AuthContext.
function DashboardView() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>; // Or a loading skeleton
  }

  switch (user.role) {
    case 'hr':
      // Suspense boundary for streaming server component data
      return <Suspense fallback={<div>Loading dashboard...</div>}><HRDashboardData /></Suspense>;
    case 'mentor':
      return <GenericDashboard name={user.name} role="Mentor" />;
    case 'intern':
      return <GenericDashboard name={user.name} role="Intern" />;
    case 'employee':
        return <GenericDashboard name={user.name} role="Employee" />;
    default:
      return <div>Invalid role.</div>;
  }
}

// The main page component remains a client component to access useAuth
export default function DashboardPage() {
  return <DashboardView />;
}
