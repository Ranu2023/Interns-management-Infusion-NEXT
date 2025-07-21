
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, Send } from "lucide-react";

const pastSubmissions = [
  { date: '2024-07-15', status: 'Submitted' },
  { date: '2024-07-14', status: 'Submitted' },
  { date: '2024-07-13', status: 'Submitted' },
  { date: '2024-07-12', status: 'Submitted' },
  { date: '2024-07-11', status: 'Submitted' },
  { date: '2024-07-10', status: 'Submitted' },
  { date: '2024-07-09', status: 'Submitted' },
  { date: '2024-07-08', status: 'Submitted' },
  { date: '2024-07-07', status: 'Submitted' },
  { date: '2024-07-06', status: 'Submitted' },
]

export default function DailyReportPage() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Progress Report</CardTitle>
                        <CardDescription>Submit your report for today, July 16, 2024.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid gap-2">
                            <Label htmlFor="yesterday-tasks">What did you accomplish yesterday?</Label>
                            <Textarea
                                id="yesterday-tasks"
                                placeholder="e.g., Completed the user authentication flow. Integrated the payment gateway API..."
                                rows={5}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="today-tasks">What are your goals for today?</Label>
                            <Textarea
                                id="today-tasks"
                                placeholder="e.g., Start working on the profile page. Write unit tests for the new components..."
                                rows={5}
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="blockers">Are there any blockers or challenges?</Label>
                            <Textarea
                                id="blockers"
                                placeholder="e.g., I'm waiting for the API documentation for the new service..."
                                rows={3}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button>
                            <Send className="mr-2 h-4 w-4" /> Submit Report
                        </Button>
                    </CardFooter>
                </Card>
            </div>
             <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Past Submissions</CardTitle>
                        <CardDescription>Your recent report history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {pastSubmissions.map((sub, index) => (
                                <li key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{sub.date}</span>
                                    </div>
                                    <span className="text-muted-foreground">{sub.status}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
