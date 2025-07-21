'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ProjectsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage all projects and task assignments.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>A list of all projects will be displayed here for management.</p>
            </CardContent>
        </Card>
    );
}
