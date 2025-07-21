'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MyFeedbackPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Feedback</CardTitle>
                <CardDescription>View feedback from your mentor.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>A summary of feedback received will be here.</p>
            </CardContent>
        </Card>
    );
}
