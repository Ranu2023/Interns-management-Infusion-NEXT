
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video } from "lucide-react";

const mentorshipSessions = [
  { id: 1, topic: "Project Kick-off & Goal Setting", date: "2024-07-20", time: "10:00 AM", status: "Upcoming", type: "Mentor" },
  { id: 2, topic: "Weekly Check-in", date: "2024-07-12", time: "02:00 PM", status: "Completed", type: "Mentor" },
  { id: 3, topic: "Code Review Session", date: "2024-07-05", time: "11:00 AM", status: "Completed", type: "Mentor" },
  { id: 4, topic: "Career Development Talk", date: "2024-07-25", time: "03:00 PM", status: "Upcoming", type: "HR" },
  { id: 5, topic: "Mid-internship Review", date: "2024-07-30", time: "10:00 AM", status: "Upcoming", type: "Mentor" },
  { id: 6, topic: "Technical Deep Dive: AI", date: "2024-08-05", time: "11:00 AM", status: "Upcoming", type: "Mentor" },
  { id: 7, topic: "Presentation Skills Workshop", date: "2024-08-10", time: "02:00 PM", status: "Upcoming", type: "HR" },
  { id: 8, topic: "Final Project Review", date: "2024-08-20", time: "10:00 AM", status: "Upcoming", type: "Mentor" },
  { id: 9, topic: "Networking Session", date: "2024-08-22", time: "04:00 PM", status: "Upcoming", type: "HR" },
  { id: 10, topic: "PPO Discussion", date: "2024-08-28", time: "11:00 AM", status: "Upcoming", type: "Mentor" },
];

export default function MentorshipPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Mentorship Hub</h1>
                <p className="text-muted-foreground">Your mentorship resources and sessions.</p>
            </div>
            <div className="grid gap-6">
                {mentorshipSessions.map((session) => (
                    <Card key={session.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${session.type === 'Mentor' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent-foreground'}`}>
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-semibold">{session.topic}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {session.date} at {session.time}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {session.status === 'Upcoming' ? (
                                    <Button variant="default" size="sm">
                                        <Video className="mr-2 h-4 w-4" />
                                        Join Call
                                    </Button>
                                ) : (
                                     <Button variant="outline" size="sm" disabled>Completed</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
