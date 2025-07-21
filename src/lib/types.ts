
export interface Intern {
    id: number;
    name: string;
    email: string;
    project: string;
    mentor: string;
    status: 'Active' | 'Completed' | 'On-Hold';
}

export interface Mentor {
    id: number;
    name: string;
    email: string;
    expertise: string;
    interns: number;
    avatar: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    status: 'In Progress' | 'Completed' | 'On-Hold' | 'Not Started';
    progress: number;
    team: string[];
    mentor: string;
}

export interface Application {
    id: number;
    name: string;
    university: string;
    date: string;
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}
