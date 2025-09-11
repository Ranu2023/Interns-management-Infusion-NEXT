
'use server';

import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Intern from "@/lib/models/Intern";
import Activity from "@/lib/models/Activity";
import { type IActivity } from "@/lib/models/Activity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatInTimeZone } from 'date-fns-tz';
import { LogIn, LogOut, FileClock } from "lucide-react";
import { ActivityActionButtons } from "./ActivityActionButtons";


async function getActivityData(internId: string) {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') {
        redirect('/dashboard');
    }

    if (!internId.match(/^[0-9a-fA-F]{24}$/)) notFound();

    await dbConnect();
    const intern = await Intern.findById(internId).lean();
    if (!intern) notFound();

    // Fetch all sessions for the intern
    const allActivities = await Activity.find({ internId }).sort({ loginTime: -1 }).lean();
    
    // Group activities by month
    const groupedActivities = allActivities.reduce((acc, activity) => {
        const month = formatInTimeZone(new Date(activity.date), 'Asia/Kolkata', 'MMMM yyyy');
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(activity);
        return acc;
    }, {} as Record<string, IActivity[]>);

    // Further group by day within each month
     for (const month in groupedActivities) {
        const activitiesForMonth = groupedActivities[month];
        const groupedByDay = activitiesForMonth.reduce((acc, activity) => {
            const dayKey = formatInTimeZone(new Date(activity.date), 'Asia/Kolkata', 'yyyy-MM-dd');
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push(activity);
            return acc;
        }, {} as Record<string, IActivity[]>);
        
        groupedActivities[month] = groupedByDay as any;
    }


    return {
        intern: JSON.parse(JSON.stringify(intern)),
        groupedActivities: JSON.parse(JSON.stringify(groupedActivities)),
    }
}


export default async function InternActivityDetailPage({ params }: { params: { internId: string } }) {
    const { internId } = params;
    const { intern, groupedActivities } = await getActivityData(internId);

    const formatIST = (date: string | Date) => {
        return formatInTimeZone(new Date(date), 'Asia/Kolkata', 'p');
    }
    const formatISTDate = (date: string | Date) => {
        return formatInTimeZone(new Date(date), 'Asia/Kolkata', 'EEEE, MMMM do');
    }

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={intern.avatar} alt={intern.name} />
                            <AvatarFallback>{intern.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{intern.name}'s Activity Log</CardTitle>
                            <CardDescription>A detailed record of all tracked activities.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {Object.keys(groupedActivities).length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground py-12">
                            <FileClock className="mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-semibold">No Activity Recorded</h3>
                            <p className="mt-2 text-sm">There are no tracked activities for this intern yet.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(groupedActivities)[0]}>
                    {Object.entries(groupedActivities).map(([month, days]) => (
                        <AccordionItem key={month} value={month}>
                             <div className="flex items-center justify-between bg-muted px-4 rounded-t-lg">
                                <AccordionTrigger className="text-lg font-medium flex-1">
                                    {month}
                                </AccordionTrigger>
                                <ActivityActionButtons internId={internId} month={month} />
                            </div>
                            <AccordionContent className="p-4 bg-muted/50 rounded-b-lg">
                                <div className="space-y-4">
                                     {Object.entries(days as Record<string, IActivity[]>).map(([day, sessions]) => (
                                        <Card key={day} className="bg-background">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <CardTitle className="text-base">{formatISTDate(day)}</CardTitle>
                                                <ActivityActionButtons internId={internId} date={day} />
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {sessions.map((session, index) => (
                                                     <div key={session._id} className="relative pl-6 border-l-2 border-dashed ml-3 py-4">
                                                        <div className="flex items-center gap-3 absolute -left-3.5 top-3">
                                                             <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                                                <LogIn className="h-4 w-4 text-white" />
                                                            </div>
                                                            <span className="text-sm font-medium">{formatIST(session.loginTime)} - Logged In</span>
                                                        </div>

                                                        <div className="space-y-2 mt-10 ml-3">
                                                            {session.activities?.map((action, actionIndex) => (
                                                                <div key={actionIndex} className="flex items-start gap-3">
                                                                    <div className="z-10 h-2 w-2 rounded-full bg-primary mt-1.5 ml-1.5" />
                                                                    <span className="text-sm font-medium tabular-nums w-20 shrink-0">{formatIST(action.timestamp)}</span>
                                                                    <span className="text-sm text-muted-foreground">{action.action}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {session.logoutTime && (
                                                            <div className="flex items-center gap-3 absolute -left-3.5 bottom-3 mt-4">
                                                                <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                                                                    <LogOut className="h-4 w-4 text-white" />
                                                                </div>
                                                                <span className="text-sm font-medium">{formatIST(session.logoutTime)} - Logged Out</span>
                                                            </div>
                                                        )}
                                                     </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                     ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

        </div>
    )
}
