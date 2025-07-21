'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MyReviewPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Performance Review</CardTitle>
                <CardDescription>Review your performance and feedback.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Your performance review details will be here.</p>
            </CardContent>
        </Card>
    );
}
