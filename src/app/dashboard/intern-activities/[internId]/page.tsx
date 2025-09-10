
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
import { format } from "date-fns";
import { LogIn, LogOut, FileClock } from "lucide-react";


async function getActivityData(internId: string) {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'hr') {
        redirect('/dashboard');
    }

    if (!internId.match(/^[0-9a-fA-F]{24}$/)) notFound();

    await dbConnect();
    const intern = await Intern.findById(internId).lean();
    if (!intern) notFound();

    const activities = await Activity.find({ internId }).sort({ date: -1 }).lean();
    
    // Group activities by month
    const groupedActivities = activities.reduce((acc, activity) => {
        const month = format(new Date(activity.date), 'MMMM yyyy');
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(activity);
        return acc;
    }, {} as Record<string, IActivity[]>);


    return {
        intern: JSON.parse(JSON.stringify(intern)),
        groupedActivities: JSON.parse(JSON.stringify(groupedActivities)),
    }
}


export default async function InternActivityDetailPage({ params }: { params: { internId: string } }) {
    const { internId } = params;
    const { intern, groupedActivities } = await getActivityData(internId);

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
                    {Object.entries(groupedActivities).map(([month, activities]) => (
                        <AccordionItem key={month} value={month}>
                            <AccordionTrigger className="text-lg font-medium bg-muted px-4 rounded-t-lg">
                                {month}
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-muted/50 rounded-b-lg">
                                <div className="space-y-4">
                                     {activities.map(dayActivity => (
                                        <Card key={dayActivity._id} className="bg-background">
                                            <CardHeader>
                                                <CardTitle className="text-base">{format(new Date(dayActivity.date), 'EEEE, MMMM do')}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {dayActivity.sessions?.map((session, index) => (
                                                     <div key={index} className="relative pl-6 border-l-2 border-dashed ml-3 py-2">
                                                        <div className="flex items-center gap-3 absolute -left-3.5 top-2">
                                                             <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                                                                <LogIn className="h-4 w-4 text-white" />
                                                            </div>
                                                            <span className="text-sm font-medium">{format(new Date(session.loginTime), 'hh:mm:ss a')} - Logged In</span>
                                                        </div>

                                                        <div className="space-y-2 mt-10 ml-3">
                                                            {session.activities?.map(action => (
                                                                <div key={action._id} className="flex items-center gap-3">
                                                                    <div className="z-10 h-2 w-2 rounded-full bg-primary ml-1.5" />
                                                                    <span className="text-sm font-medium">{format(new Date(action.timestamp), 'hh:mm:ss a')}</span>
                                                                    <span className="text-sm text-muted-foreground">{action.action}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {session.logoutTime && (
                                                            <div className="flex items-center gap-3 absolute -left-3.5 bottom-2">
                                                                <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                                                                    <LogOut className="h-4 w-4 text-white" />
                                                                </div>
                                                                <span className="text-sm font-medium">{format(new Date(session.logoutTime), 'hh:mm:ss a')} - Logged Out</span>
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
