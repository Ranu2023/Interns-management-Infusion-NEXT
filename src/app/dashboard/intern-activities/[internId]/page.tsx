
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
    const { intern, groupedActivities } = await getActivityData(params.internId);

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
                                        <div key={dayActivity._id}>
                                            <h4 className="font-semibold mb-2">{format(new Date(dayActivity.date), 'EEEE, MMMM do')}</h4>
                                            <div className="relative pl-6">
                                                <div className="absolute left-2.5 h-full w-0.5 bg-border" />
                                                <div className="space-y-4">
                                                    {dayActivity.loginTime && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                                                <LogIn className="h-3 w-3 text-white" />
                                                            </div>
                                                            <span className="text-sm font-medium">{format(new Date(dayActivity.loginTime), 'hh:mm:ss a')}</span>
                                                            <span className="text-sm text-muted-foreground">Logged In</span>
                                                        </div>
                                                    )}
                                                    {dayActivity.activities?.map(action => (
                                                         <div key={action._id} className="flex items-center gap-3">
                                                            <div className="z-10 h-2 w-2 rounded-full bg-primary ml-1.5" />
                                                            <span className="text-sm font-medium">{format(new Date(action.timestamp), 'hh:mm:ss a')}</span>
                                                            <span className="text-sm text-muted-foreground">{action.action}</span>
                                                        </div>
                                                    ))}
                                                    {dayActivity.logoutTime && (
                                                        <div className="flex items-center gap-3">
                                                             <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                                                                <LogOut className="h-3 w-3 text-white" />
                                                            </div>
                                                            <span className="text-sm font-medium">{format(new Date(dayActivity.logoutTime), 'hh:mm:ss a')}</span>
                                                            <span className="text-sm text-muted-foreground">Logged Out</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
