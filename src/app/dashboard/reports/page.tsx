'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Reports</CardTitle>
                <CardDescription>View and manage intern reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>A list of intern reports will be available here for review.</p>
            </CardContent>
        </Card>
    );
}
