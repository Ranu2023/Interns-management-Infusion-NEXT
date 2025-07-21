'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function InternsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Management</CardTitle>
                <CardDescription>View and manage all interns.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>A table of interns will be displayed here.</p>
            </CardContent>
        </Card>
    );
}
