
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Handshake } from "lucide-react";

// The hardcoded data has been removed.
const mentorshipSessions: any[] = [];

export default function MentorshipPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">Mentorship Hub</h1>
                <p className="text-muted-foreground">Your mentorship resources and sessions.</p>
            </div>
            <div className="grid gap-6">
                {mentorshipSessions.length > 0 ? (
                    mentorshipSessions.map((session) => (
                        <Card key={session.id}>
                            {/* Card content removed for brevity */}
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground py-12">
                                <Handshake className="mx-auto h-12 w-12" />
                                <h3 className="mt-4 text-lg font-semibold">No Sessions Scheduled</h3>
                                <p className="mt-2 text-sm">
                                    Your mentor has not scheduled any sessions yet.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
