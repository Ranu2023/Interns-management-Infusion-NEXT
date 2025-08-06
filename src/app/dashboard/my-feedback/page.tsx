
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dbConnect from "@/lib/db";
import { getSession } from "@/lib/session";
import Intern from "@/lib/models/Intern";
import DailyReport, { type IDailyReport } from "@/lib/models/DailyReport";

async function getMyFeedback(): Promise<IDailyReport[]> {
    const session = await getSession();
    if (!session?.user) return [];

    await dbConnect();
    const intern = await Intern.findOne({ email: session.user.email }).lean();
    if (!intern) return [];

    const reports = await DailyReport.find({
        internId: intern._id,
        mentorFeedback: { $exists: true }
    }).sort({ 'mentorFeedback.date': -1 }).lean();

    return JSON.parse(JSON.stringify(reports));
}

const getFeedbackIcon = (status: string) => {
    switch (status) {
        case 'Approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
        case 'Changes-Required': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        default: return <MessageSquare className="h-5 w-5" />;
    }
}

export default async function MyFeedbackPage() {
    const feedbackItems = await getMyFeedback();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Feedback</h1>
                <p className="text-muted-foreground">View feedback from your mentor on your daily reports.</p>
            </div>
            <div className="space-y-6">
                {feedbackItems.length > 0 ? (
                    feedbackItems.map((item) => (
                        <Card key={item._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">Feedback on Report for {item.projectName}</CardTitle>
                                        <CardDescription>Submitted on {new Date(item.date).toLocaleDateString()} | Reviewed on {new Date(item.mentorFeedback!.date).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getFeedbackIcon(item.mentorFeedback!.status)}
                                        <Badge variant={
                                            item.mentorFeedback!.status === 'Approved' ? 'secondary' :
                                            item.mentorFeedback!.status === 'Rejected' ? 'destructive' :
                                            'default'
                                        }>{item.mentorFeedback!.status.replace('-', ' ')}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            {item.mentorFeedback?.comments && (
                                <CardContent>
                                    <p className="text-sm font-semibold mb-2">Mentor's Comments:</p>
                                    <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                                       "{item.mentorFeedback.comments}"
                                    </blockquote>
                                </CardContent>
                            )}
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground py-12">
                                <MessageSquare className="mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No Feedback Yet</h3>
                                <p className="mt-2 text-sm">
                                    Your mentor has not provided any feedback yet. Check back later!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
