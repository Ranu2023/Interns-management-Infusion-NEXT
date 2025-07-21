'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DailyReportPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Report</CardTitle>
                <CardDescription>Submit your daily progress report.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Daily report submission form will be here.</p>
            </CardContent>
        </Card>
    );
}
