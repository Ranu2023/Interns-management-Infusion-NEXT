'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PPOStatusPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>PPO Status</CardTitle>
                <CardDescription>Check the status of your Pre-Placement Offer.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Your PPO status and related information will be displayed here.</p>
            </CardContent>
        </Card>
    );
}
