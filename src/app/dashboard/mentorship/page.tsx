'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MentorshipPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mentorship</CardTitle>
                <CardDescription>Your mentorship resources and sessions.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Details about mentorship guidance, scheduled meetings, and feedback will be here.</p>
            </CardContent>
        </Card>
    );
}
