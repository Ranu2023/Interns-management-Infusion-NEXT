
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Send, ThumbsDown, ThumbsUp, Briefcase, Award, GraduationCap, Mic, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/db";
import Intern from "@/lib/models/Intern";
import { type IIntern } from "@/lib/models/Intern";
import { updatePPODecision } from "@/lib/actions";
import { getSession } from '@/lib/session';
import { formatInTimeZone } from "date-fns-tz";

type TimelineStep = {
    id: number;
    title: string;
    status: 'Completed' | 'In Progress' | 'Pending';
    icon: React.ReactElement;
    date: Date | null;
};

async function getInternData(email: string): Promise<IIntern | null> {
    await dbConnect();
    const intern = await Intern.findOne({ email }).lean();
    return intern;
}

export default async function PPOStatusPage() {
    const session = await getSession();
    if (!session?.user) {
        // This case should be handled by middleware, but as a fallback:
        return <Card><CardContent className="pt-6"><p>Session not found. Please log in.</p></CardContent></Card>;
    }
    
    const intern = await getInternData(session.user.email);

    if (!intern) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>PPO Status</CardTitle>
                    <CardDescription>Check the status of your Pre-Placement Offer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-20">
                        <Briefcase className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No PPO Information Available</h3>
                        <p className="mt-2 text-sm">
                           Your PPO status will be updated here by the HR team.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    const { ppoStatus, ppoDecision } = intern;
    let currentStatus = ppoStatus || 'Pending';
    let statusDescription = "Your performance is currently being evaluated for a Pre-Placement Offer.";

    if (ppoStatus === 'Recommended' && ppoDecision === 'Pending') {
        currentStatus = 'Offer Extended';
        statusDescription = "Congratulations! You have been recommended for a Pre-Placement Offer. Please review and respond below.";
    } else if (ppoStatus === 'Not Recommended') {
        currentStatus = 'Not Recommended';
        statusDescription = "After careful consideration, we have decided not to extend a Pre-Placement Offer at this time. We appreciate your hard work and wish you the best in your future endeavors.";
    } else if (ppoDecision === 'Accepted') {
        currentStatus = 'Offer Accepted';
        statusDescription = "You have accepted the Pre-Placement Offer. Welcome aboard! HR will be in touch with the next steps.";
    } else if (ppoDecision === 'Rejected') {
        currentStatus = 'Offer Rejected';
        statusDescription = "You have rejected the Pre-Placement Offer. We thank you for your contributions during the internship.";
    }


    const acceptAction = updatePPODecision.bind(null, intern._id.toString(), 'Accepted');
    const rejectAction = updatePPODecision.bind(null, intern._id.toString(), 'Rejected');

    const formatISTDate = (date: Date) => {
        return formatInTimeZone(date, 'Asia/Kolkata', 'PP');
    }

    // Dynamically generate the timeline
    const timelineSteps: TimelineStep[] = [
        { id: 1, title: 'Internship Started', date: intern.internshipStartDate || null, icon: <Award />, status: 'Pending' },
        { id: 2, title: 'Final Assessment Submitted', date: intern.finalAssessmentDate || null, icon: <GraduationCap />, status: 'Pending' },
        { id: 3, title: 'Mentor PPO Recommendation', date: intern.ppoRecommendationDate || null, icon: <UserCheck />, status: 'Pending' },
        { id: 4, title: 'HR Interview Scheduled', date: intern.hrInterviewDate || null, icon: <Mic />, status: 'Pending' },
        { id: 5, title: 'Final Decision Made', date: intern.finalDecisionDate || null, icon: <Briefcase />, status: 'Pending' },
    ];
    
    let inProgressFound = false;
    for (const step of timelineSteps.reverse()) {
        if (step.date) {
            step.status = 'Completed';
        } else if (!inProgressFound) {
            step.status = 'In Progress';
            inProgressFound = true;
        } else {
            step.status = 'Pending';
        }
    }
    timelineSteps.reverse();


    return (
        <Card>
            <CardHeader>
                <CardTitle>PPO Status</CardTitle>
                <CardDescription>Check the status of your Pre-Placement Offer.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Status: <Badge variant={
                                ppoStatus === 'Recommended' ? 'default' :
                                ppoStatus === 'Not Recommended' ? 'destructive' :
                                'secondary'
                            }>{currentStatus}</Badge></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{statusDescription}</p>
                            
                            {ppoStatus === 'Recommended' && ppoDecision === 'Pending' && (
                                <div className="mt-6 flex gap-4">
                                     <form action={acceptAction}>
                                        <Button>
                                            <ThumbsUp className="mr-2"/> Accept Offer
                                        </Button>
                                    </form>
                                    <form action={rejectAction}>
                                        <Button variant="destructive">
                                            <ThumbsDown className="mr-2"/> Reject Offer
                                        </Button>
                                    </form>
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="font-semibold mb-4">PPO Process Timeline</h3>
                                <div className="relative">
                                    <div className="absolute left-3 top-0 h-full w-0.5 bg-border" />
                                    <ul className="space-y-8">
                                        {timelineSteps.map((item) => (
                                            <li key={item.id} className="flex items-start gap-4">
                                                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${item.status === 'Completed' ? 'bg-green-500 text-white' : item.status === 'In Progress' ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    {item.date && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatISTDate(item.date)}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">You will be notified via email about any status changes. No action is required from your side unless an offer is extended.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Have Questions?</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground mb-4">If you have any questions about the PPO process, please reach out to the HR team.</p>
                           <Button>
                               <Send className="mr-2 h-4 w-4" />
                               Contact HR
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}
