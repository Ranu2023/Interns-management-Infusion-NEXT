'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

const data = [
  { name: 'Jan', ppo: 4, rejected: 1 },
  { name: 'Feb', ppo: 3, rejected: 2 },
  { name: 'Mar', ppo: 6, rejected: 1 },
  { name: 'Apr', ppo: 5, rejected: 3 },
  { name: 'May', ppo: 8, rejected: 2 },
  { name: 'Jun', ppo: 7, rejected: 4 },
];

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PPO Trends</CardTitle>
        <CardDescription>PPO offers vs rejections in the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Bar dataKey="ppo" fill="hsl(var(--primary))" name="PPOs Offered" />
            <Bar dataKey="rejected" fill="hsl(var(--accent))" name="PPOs Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
