
'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from '@/lib/utils';

const COLORS: Record<string, string> = {
  'In Progress': 'hsl(var(--primary))',
  'Completed': 'hsl(var(--chart-2))', // A secondary color
  'On-Hold': 'hsl(var(--destructive))',
  'Not Started': 'hsl(var(--muted-foreground))',
};

const defaultData = [
    { status: 'In Progress', value: 0 },
    { status: 'Completed', value: 0 },
    { status: 'On-Hold', value: 0 },
];

export function ProjectStatusChart({ data }: { data: { status: string; value: number }[] }) {

  const chartData = data && data.length > 0 ? data : defaultData;
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Overview</CardTitle>
        <CardDescription>A breakdown of all projects by their current status.</CardDescription>
      </CardHeader>
      <CardContent>
         {hasData ? (
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="status"
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            if (percent === 0) return null;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            return (
                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            );
                        }}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#cccccc'} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
         ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No project data available to display.</p>
            </div>
         )}
      </CardContent>
    </Card>
  );
}
