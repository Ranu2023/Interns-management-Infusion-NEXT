

export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export interface Intern {
    _id?: string;
    id: number;
    name: string;
    email: string;
    project: string;
    mentor: string;
    status: 'Active' | 'Completed' | 'On-Hold';
    assessmentScore?: number;
    ppoStatus?: 'Recommended' | 'Not Recommended' | 'Pending';
    ppoReasoning?: string;
}

export interface Mentor {
    _id?: string;
    id: number;
    name: string;
    email: string;
    expertise: string;
    interns: number;
    avatar: string;
}

export interface Project {
    _id?: string;
    id: number;
    title: string;
    description: string;
    status: 'In Progress' | 'Completed' | 'On-Hold' | 'Not Started';
    team: string[];
    mentor: string;
    document: string | null;
    recentActivity: string;
    tasks: Task[];
    progress?: number;
}

export interface Application {
    _id?: string;
    id: number;
    name: string;
    university: string;
    date: string;
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}
