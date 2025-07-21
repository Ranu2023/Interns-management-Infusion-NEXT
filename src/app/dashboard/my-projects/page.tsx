'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MyProjectsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>View your assigned projects and tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>A list of your projects and their status will be here.</p>
            </CardContent>
        </Card>
    );
}
