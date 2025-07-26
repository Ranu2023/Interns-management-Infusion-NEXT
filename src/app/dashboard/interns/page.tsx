
'use server';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

async function getDataForUser() {
  const session = await getSession();
  const user = session?.user as User;

  if (!user) {
    redirect('/');
  }

  await dbConnect();

  // HR sees all interns, other roles see only their own record.
  const query = user.role === 'hr' ? {} : { email: user.email };
  const interns = await Intern.find(query).lean();

  return interns.map(intern => ({
    ...intern,
    _id: intern._id.toString(),
  }));
}

export default async function InternsPage() {
  const interns = await getDataForUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interns</CardTitle>
        <CardDescription>
          View and manage intern profiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {interns.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
                No intern records found.
            </div>
         ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Profile</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {interns.map((intern) => (
                <TableRow key={intern._id}>
                    <TableCell className="font-medium">{intern.name}</TableCell>
                    <TableCell>{intern.email}</TableCell>
                    <TableCell>{intern.project}</TableCell>
                    <TableCell>{intern.mentor}</TableCell>
                    <TableCell>
                    <Badge
                        variant={
                        intern.status === 'Active'
                            ? 'default'
                            : intern.status === 'Completed'
                            ? 'secondary'
                            : 'destructive'
                        }
                    >
                        {intern.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/intern/${intern._id}`}>
                        View <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
         )}
      </CardContent>
    </Card>
  );
}
