
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileUp } from "lucide-react";
import dbConnect from '@/lib/db';
import Intern from '@/lib/models/Intern';
import { getSession } from '@/lib/session';
import { User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';

type InternWithTimeline = {
    _id: string;
    name: string;
    email: string;
    internshipStartDate: string;
    internshipEndDate: string;
    daysRemaining: number;
    status: 'Ongoing' | 'Nearing Completion' | 'Completed';
}

async function getInternsForDocumentAssignment(): Promise<InternWithTimeline[]> {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') redirect('/dashboard');
    
    await dbConnect();
    const interns = await Intern.find({}).lean();
    
    return interns.map(intern => {
        const endDate = new Date(intern.internshipEndDate || new Date());
        const now = new Date();
        const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        
        let status: 'Ongoing' | 'Nearing Completion' | 'Completed' = 'Ongoing';
        if (daysRemaining <= 0) {
            status = 'Completed';
        } else if (daysRemaining <= 5) {
            status = 'Nearing Completion';
        }

        return {
            _id: intern._id.toString(),
            name: intern.name,
            email: intern.email,
            internshipStartDate: formatInTimeZone(new Date(intern.internshipStartDate || ''), 'Asia/Kolkata', 'PP'),
            internshipEndDate: formatInTimeZone(endDate, 'Asia/Kolkata', 'PP'),
            daysRemaining,
            status,
        };
    }).sort((a,b) => a.daysRemaining - b.daysRemaining);
}


export default async function AssignDocumentsPage() {
    const interns = await getInternsForDocumentAssignment();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assign Completion Documents</CardTitle>
                <CardDescription>View interns nearing the end of their term and assign their final documents.</CardDescription>
            </CardHeader>
            <CardContent>
               {interns.length === 0 ? (
                 <div className="text-center text-muted-foreground py-12">
                    There are no intern records in the system.
                </div>
               ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Intern Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Days Remaining</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {interns.map((intern) => (
                            <TableRow key={intern._id}>
                                <TableCell className="font-medium">{intern.name}</TableCell>
                                <TableCell>{intern.email}</TableCell>
                                <TableCell>{intern.internshipEndDate}</TableCell>
                                <TableCell>{intern.daysRemaining}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        intern.status === 'Completed' ? 'secondary' :
                                        intern.status === 'Nearing Completion' ? 'destructive' : 'default'
                                    }>
                                        {intern.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm" disabled={intern.daysRemaining > 5 && intern.status !== 'Completed'}>
                                        <Link href={`/dashboard/assign-documents/${intern._id}`}>
                                           <FileUp className="mr-2 h-4 w-4" />
                                           Assign
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
