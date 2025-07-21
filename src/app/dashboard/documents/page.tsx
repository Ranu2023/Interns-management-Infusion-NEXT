'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DocumentsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Access your important documents.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>A list of downloadable documents like certificates and LORs will be here.</p>
            </CardContent>
        </Card>
    );
}
