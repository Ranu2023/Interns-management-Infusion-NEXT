
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCog, Briefcase } from 'lucide-react';

export default function AddApplicantPage() {
  return (
    <div>
       <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Add New Applicant</h1>
        <p className="text-muted-foreground">Select the type of user you want to add to the system.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <UserPlus className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Add Intern</CardTitle>
            <CardDescription>Onboard a new intern by providing their details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/add-applicant/add-intern">Add Intern</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Briefcase className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Add Mentor</CardTitle>
            <CardDescription>Onboard a new mentor to guide interns.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/add-applicant/add-mentor">Add Mentor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <UserCog className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Add HR</CardTitle>
            <CardDescription>Onboard a new HR member to manage the system.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild className="w-full">
              <Link href="/dashboard/add-applicant/add-hr">Add HR</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
