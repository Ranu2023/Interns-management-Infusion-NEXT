
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

type ChartData = {
    name: string;
    'PPOs Offered': number;
    'PPOs Rejected': number;
}

export function OverviewChart({ data }: { data: ChartData[] }) {
  const hasData = data && data.length > 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>PPO Trends</CardTitle>
        <CardDescription>PPO offers vs rejections in the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                    />
                    <Legend />
                    <Bar dataKey="PPOs Offered" fill="hsl(var(--primary))" name="PPOs Offered" />
                    <Bar dataKey="PPOs Rejected" fill="hsl(var(--destructive))" name="PPOs Rejected" />
                </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No PPO decision data available for the last 6 months.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
