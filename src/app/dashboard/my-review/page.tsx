
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart, PenSquare } from 'lucide-react';


// The hardcoded data has been removed.
const performanceData: any[] = [];
const skillData: any[] = [];

export default function MyReviewPage() {
    const hasData = performanceData.length > 0 && skillData.length > 0;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Performance Review</h1>
                <p className="text-muted-foreground">A summary of your performance throughout the internship.</p>
            </div>
            {hasData ? (
                <div className="grid gap-6 lg:grid-cols-3">
                   {/* Chart components would go here if data existed */}
                </div>
             ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground py-20">
                            <PenSquare className="mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-semibold">Performance Review Not Available</h3>
                            <p className="mt-2 text-sm">
                                Your performance review will be available here after your mentor completes it.
                            </p>
                        </div>
                    </CardContent>
                </Card>
             )}
        </div>
    );
}
