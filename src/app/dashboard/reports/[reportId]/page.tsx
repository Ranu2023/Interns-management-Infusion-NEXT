
'use server';

import { notFound, redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import DailyReport from '@/lib/models/DailyReport';
import Intern from '@/lib/models/Intern';
import Mentor from '@/lib/models/Mentor';
import Project from '@/lib/models/Project';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/session';
import { type User } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Send, ThumbsDown, ThumbsUp, Briefcase, Award, GraduationCap, Mic, UserCheck, XCircle, AlertTriangle, ListChecks } from "lucide-react";
import { FeedbackForm } from './FeedbackForm';


async function getReportData(reportId: string, user: User) {
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) return null;

    await dbConnect();
    const report = await DailyReport.findById(reportId)
        .populate({ path: 'internId', model: Intern, select: 'name email' })
        .populate({ path: 'projectId', model: Project, select: 'tasks' })
        .lean();

    if (!report) return null;

    // Security check: ensure the user is the mentor for this report
    const mentor = await Mentor.findById(report.mentorId).lean();
    if (mentor?.email !== user.email) {
        return null;
    }
    
    return JSON.parse(JSON.stringify(report));
}

const getFeedbackIcon = (status: string) => {
    switch (status) {
        case 'Approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
        case 'Changes-Required': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        default: return <FileText className="h-5 w-5" />;
    }
}


export default async function ReportFeedbackPage({ params }: { params: { reportId: string }}) {
    const session = await getSession();
    if(!session?.user || session.user.role !== 'mentor') redirect('/dashboard');

    const report = await getReportData(params.reportId, session.user);

    if (!report) {
        notFound();
    }
    
    const getTaskTitleById = (id: string) => {
        const taskIdNumber = parseInt(id, 10);
        const task = report.projectId.tasks.find((t: any) => t.id === taskIdNumber);
        return task ? task.title : `Task ID ${id} not found`;
    }

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Report Details</CardTitle>
                        <CardDescription>
                            From {report.internId.name} for project "{report.projectName}" on {new Date(report.date).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         {report.completedTasks && report.completedTasks.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-base flex items-center gap-2"><ListChecks className="h-5 w-5" /> Completed Tasks</h3>
                                <ul className="list-disc list-inside text-muted-foreground text-sm mt-2 space-y-1">
                                    {report.completedTasks.map((taskId: string) => (
                                        <li key={taskId}>{getTaskTitleById(taskId)}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-base">Progress Note</h3>
                            <p className="text-muted-foreground text-sm mt-1">{report.progressNote}</p>
                        </div>
                        {report.blockers && (
                             <div>
                                <h3 className="font-semibold text-base">Blockers</h3>
                                <p className="text-muted-foreground text-sm mt-1">{report.blockers}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Provide Feedback</CardTitle>
                        <CardDescription>Review the report and submit your feedback.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {report.mentorFeedback ? (
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Feedback Already Submitted</h4>
                                <div className="flex items-center gap-2">
                                     {getFeedbackIcon(report.mentorFeedback.status)}
                                    <Badge variant={
                                        report.mentorFeedback.status === 'Approved' ? 'secondary' :
                                        report.mentorFeedback.status === 'Rejected' ? 'destructive' :
                                        'default'
                                    }>{report.mentorFeedback.status.replace('-', ' ')}</Badge>
                                </div>
                                {report.mentorFeedback.comments && (
                                     <blockquote className="border-l-2 pl-4 italic text-muted-foreground mt-3 text-sm">
                                       "{report.mentorFeedback.comments}"
                                    </blockquote>
                                )}
                            </div>
                        ) : (
                           <FeedbackForm reportId={report._id} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
