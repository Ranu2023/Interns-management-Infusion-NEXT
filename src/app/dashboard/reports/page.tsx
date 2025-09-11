
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText } from "lucide-react";
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/session';
import DailyReport from '@/lib/models/DailyReport';
import Intern from '@/lib/models/Intern';
import { type User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';

async function getMyInternsReports() {
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user.role !== 'mentor') redirect('/dashboard');
    
    await dbConnect();
    
    const myInterns = await Intern.find({ mentor: user.name }).select('_id').lean();
    const myInternIds = myInterns.map(i => i._id);

    const reports = await DailyReport.find({ internId: { $in: myInternIds } })
        .populate({ path: 'internId', model: Intern, select: 'name' })
        .sort({ date: -1 })
        .lean();
    
    return JSON.parse(JSON.stringify(reports));
}

export default async function ReportsPage() {
    const reports = await getMyInternsReports();

    const formatIST = (date: Date | string) => {
        return formatInTimeZone(new Date(date), 'Asia/Kolkata', 'PP');
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Daily Reports</CardTitle>
                <CardDescription>View and provide feedback on reports from your interns.</CardDescription>
            </CardHeader>
            <CardContent>
                {reports.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <FileText className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Reports Submitted</h3>
                        <p className="mt-2 text-sm">
                            Your assigned interns have not submitted any daily reports yet.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Intern Name</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Submission Date</TableHead>
                                <TableHead>Feedback Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report: any) => (
                                <TableRow key={report._id}>
                                    <TableCell className="font-medium">{report.internId?.name || 'N/A'}</TableCell>
                                    <TableCell>{report.projectName}</TableCell>
                                    <TableCell>{formatIST(report.date)}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.mentorFeedback ? "secondary" : "outline"}>
                                            {report.mentorFeedback ? 'Feedback Sent' : 'Pending Review'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/reports/${report._id}`}>
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
