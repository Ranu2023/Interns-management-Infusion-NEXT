
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

// The hardcoded data has been removed to be replaced by a dynamic fetch in a future step.
// For now, we represent the "no data" state for a new user.
const feedbackItems: any[] = [];

export default function MyFeedbackPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Feedback</h1>
                <p className="text-muted-foreground">View feedback from your mentor and track your growth.</p>
            </div>
            <div className="space-y-6">
                {feedbackItems.length > 0 ? (
                    feedbackItems.map((item) => (
                        <Card key={item.id}>
                            <CardHeader className="flex flex-row items-start justify-between">
                                {/* Content removed for brevity as it's not currently used */}
                            </CardHeader>
                            <CardContent>
                                <p className="italic">"{item.content}"</p>
                            </CardContent>
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
