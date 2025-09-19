
'use server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitCommit, Github, AlertTriangle } from "lucide-react";
import dbConnect from '@/lib/db';
import { getSession } from '@/lib/session';
import Intern from '@/lib/models/Intern';
import Project from '@/lib/models/Project';
import { type User } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatInTimeZone } from 'date-fns-tz';


type InternWithRepo = {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    githubRepo?: string;
    lastCommitMessage?: string;
    lastCommitDate?: string;
}

async function getLatestCommit(repoUrl: string): Promise<{ message: string; date: string } | null> {
    if (!process.env.GITHUB_API_TOKEN) {
        console.warn("GITHUB_API_TOKEN is not set. Cannot fetch commit data.");
        return null;
    }

    const urlParts = repoUrl.replace('https://github.com/', '').split('/');
    if (urlParts.length < 2) return null;
    const owner = urlParts[0];
    const repo = urlParts[1].replace('.git', '');

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            // Revalidate every hour to avoid hitting API limits excessively
            next: { revalidate: 3600 } 
        });

        if (!response.ok) {
            console.error(`GitHub API error for ${repoUrl}: ${response.statusText}`);
            return null;
        }

        const commits = await response.json();
        if (commits.length === 0) {
            return null;
        }

        const latestCommit = commits[0];
        return {
            message: latestCommit.commit.message.split('\n')[0], // Get first line of message
            date: latestCommit.commit.author.date,
        };
    } catch (error) {
        console.error(`Failed to fetch commits for ${repoUrl}:`, error);
        return null;
    }
}


async function getMyInternsWithRepos(user: User): Promise<InternWithRepo[]> {
    if (!user || user.role !== 'mentor') {
        redirect('/dashboard');
    }

    await dbConnect();
    const interns = await Intern.find({ mentor: user.name }).lean();
    if (interns.length === 0) return [];

    const projectTitles = interns.map(i => i.project).filter(Boolean);
    const projects = await Project.find({ title: { $in: projectTitles } }).lean();

    const repoMap = new Map(projects.map(p => [p.title, p.githubRepo]));
    
    const internsWithCommits = await Promise.all(interns.map(async (intern) => {
        const repo = repoMap.get(intern.project);
        let commit = null;
        if (repo) {
            commit = await getLatestCommit(repo);
        }

        return {
            _id: intern._id.toString(),
            name: intern.name,
            email: intern.email,
            avatar: intern.avatar,
            githubRepo: repo,
            lastCommitMessage: commit?.message,
            lastCommitDate: commit?.date,
        };
    }));

    return internsWithCommits;
}


export default async function CodeReportsPage() {
    const session = await getSession();
    if (!session?.user) redirect('/');
    
    const interns = await getMyInternsWithRepos(session.user);

    const formatIST = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return formatInTimeZone(new Date(dateString), 'Asia/Kolkata', 'MMM dd, yyyy @ h:mm a');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Intern Code Reports</CardTitle>
                <CardDescription>
                    Track the latest GitHub commits from your assigned interns.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {interns.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <GitCommit className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No Interns Found</h3>
                        <p className="mt-2 text-sm">You do not have any interns assigned to you.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Intern</TableHead>
                                <TableHead>Last Commit</TableHead>
                                <TableHead>Commit Date (IST)</TableHead>
                                <TableHead className="text-right">Repository</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interns.map((intern) => (
                                <TableRow key={intern._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={intern.avatar} alt={intern.name} />
                                                <AvatarFallback>{intern.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{intern.name}</p>
                                                <p className="text-sm text-muted-foreground">{intern.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {intern.lastCommitMessage ? (
                                            <p className="font-mono text-sm">{intern.lastCommitMessage}</p>
                                        ): (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                <span>No commits pushed yet.</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatIST(intern.lastCommitDate)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {intern.githubRepo ? (
                                             <Button asChild variant="outline" size="sm">
                                                <Link href={intern.githubRepo} target="_blank" rel="noopener noreferrer">
                                                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                                                </Link>
                                            </Button>
                                        ): (
                                            <span className="text-xs text-destructive-foreground bg-destructive p-2 rounded-md">No Repo Submitted</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
