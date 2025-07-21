
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const performanceData = [
  { name: 'Week 1', score: 75 },
  { name: 'Week 2', score: 80 },
  { name: 'Week 3', score: 78 },
  { name: 'Week 4', score: 85 },
  { name: 'Week 5', score: 88 },
  { name: 'Week 6', score: 92 },
  { name: 'Week 7', score: 90 },
  { name: 'Week 8', score: 95 },
  { name: 'Week 9', score: 94 },
  { name: 'Week 10', score: 98 },
];

const skillData = [
  { subject: 'Technical', A: 90, fullMark: 100 },
  { subject: 'Communication', A: 85, fullMark: 100 },
  { subject: 'Problem Solving', A: 95, fullMark: 100 },
  { subject: 'Proactiveness', A: 80, fullMark: 100 },
  { subject: 'Teamwork', A: 92, fullMark: 100 },
];

export default function MyReviewPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Performance Review</h1>
                <p className="text-muted-foreground">A summary of your performance throughout the internship.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Trend</CardTitle>
                            <CardDescription>Your weekly performance score over the internship period.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))',
                                        }}
                                    />
                                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Skills Radar</CardTitle>
                            <CardDescription>Your proficiency across key areas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="subject" fontSize={12} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
                                  <Radar name="My Skills" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                  <Tooltip contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}/>
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Strengths & Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Zap className="text-green-500"/> Strengths</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Exceptional problem-solving and debugging skills.</li>
                                <li>High-quality, clean, and maintainable code.</li>
                                <li>Strong collaborative spirit and effective team player.</li>
                                <li>Quick learner, able to adapt to new technologies.</li>
                                <li>Consistently positive attitude and high motivation.</li>
                                <li>Excellent verbal communication skills in team meetings.</li>
                                <li>Good at taking initiative on tasks.</li>
                                <li>Strong sense of ownership over projects.</li>
                                <li>Detail-oriented in code reviews.</li>
                                <li>Punctual and professional in all interactions.</li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><TrendingUp className="text-blue-500"/> Areas for Improvement</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Improve time estimation for complex tasks.</li>
                                <li>Increase frequency of providing written documentation.</li>
                                <li>Broaden unit testing to cover more edge cases.</li>
                                <li>Develop more confidence in presenting to larger audiences.</li>
                                <li>Explore more advanced features of the core technologies.</li>
                                <li>Seek feedback more proactively from peers.</li>
                                <li>Enhance git commit message detail.</li>
                                <li>Practice breaking down large tasks into smaller sub-tasks.</li>
                                <li>Work on non-blocking communication for status updates.</li>
                                <li>Improve delegation skills in group projects.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
