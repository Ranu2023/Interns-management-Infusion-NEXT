
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getDb } from '@/lib/mongodb';
import { type Intern } from '@/lib/types';

// Mock fetching interns assigned to the current mentor.
// In a real app, you'd filter by mentor ID.
async function getMyInterns() {
    const db = await getDb();
    const interns = await db.collection<Intern>('interns').find({ mentor: "Dr. Guide" }, { projection: { _id: 0 } }).limit(10).toArray();
    
    // In a real app with proper project data relation:
    // For now, we'll add mock progress to display on the UI
    const projects = await db.collection('projects').find({}, { projection: { _id: 0, title: 1, progress: 1 } }).toArray();
    const projectProgressMap = new Map(projects.map(p => [p.title, p.progress]));

    return interns.map(intern => ({
        ...intern,
        progress: projectProgressMap.get(intern.project) || 0,
        avatar: "https://placehold.co/100x100.png",
    }));
}


export default async function MyInternsPage() {
    const myInterns = await getMyInterns();

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Interns</CardTitle>
                <CardDescription>View and manage the interns assigned to you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Intern</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myInterns.map((intern) => (
                            <TableRow key={intern.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={intern.avatar} alt={intern.name} data-ai-hint="avatar person" />
                                            <AvatarFallback>{intern.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{intern.name}</p>
                                            <p className="text-sm text-muted-foreground">{intern.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{intern.project}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={intern.progress} className="w-24" />
                                        <span className="text-sm text-muted-foreground">{intern.progress}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <Badge variant={intern.status === 'Active' ? 'default' : 'secondary'}>
                                        {intern.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/dashboard/intern/${intern.id}`}>
                                            Manage <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// Revalidate the page every 60 seconds to fetch fresh data
export const revalidate = 60;
