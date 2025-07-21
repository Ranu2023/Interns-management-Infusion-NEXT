
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle, Clock, FileText, Send, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const timeline = [
  { id: 1, title: "Internship Started", date: "2024-05-15", status: "Completed", icon: <CheckCircle /> },
  { id: 2, title: "Mid-term Review", date: "2024-06-20", status: "Completed", icon: <CheckCircle /> },
  { id: 3, title: "Final Presentation", date: "2024-07-25", status: "Completed", icon: <CheckCircle /> },
  { id: 4, title: "PPO Consideration", date: "2024-07-28", status: "In Progress", icon: <Clock /> },
  { id: 5, title: "HR Interview", date: "TBD", status: "Pending", icon: <Clock /> },
  { id: 6, title: "Final Decision", date: "TBD", status: "Pending", icon: <Clock /> },
  { id: 7, title: "Offer Letter", date: "TBD", status: "Pending", icon: <Clock /> },
  { id: 8, title: "Offer Acceptance Deadline", date: "TBD", status: "Pending", icon: <Clock /> },
  { id: 9, title: "Onboarding", date: "TBD", status: "Pending", icon: <Clock /> },
  { id: 10, title: "Start Date", date: "TBD", status: "Pending", icon: <Clock /> },
];

export default function PPOStatusPage() {
    const currentStatus = "PPO Consideration";
    const statusDescription = "Your performance is currently being evaluated for a Pre-Placement Offer. The committee is reviewing your project work, mentor feedback, and overall contribution.";

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
                            <CardTitle>Current Status: <Badge>{currentStatus}</Badge></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{statusDescription}</p>
                            <div className="mt-6">
                                <h3 className="font-semibold mb-4">PPO Process Timeline</h3>
                                <div className="relative">
                                    <div className="absolute left-3 top-0 h-full w-0.5 bg-border" />
                                    <ul className="space-y-8">
                                        {timeline.slice(0, 6).map((item) => (
                                            <li key={item.id} className="flex items-start gap-4">
                                                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${item.status === 'Completed' ? 'bg-green-500 text-white' : item.status === 'In Progress' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">{item.date}</p>
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
                           <p className="text-sm text-muted-foreground">You will be notified via email if you are selected for an HR interview. No action is required from your side at the moment.</p>
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
