
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const mentors = [
  { id: 1, name: "Dr. Guide", email: "mentor@synergy.com", expertise: "AI/ML", interns: 2, avatar: "https://placehold.co/100x100.png" },
  { id: 2, name: "Jane Doe", email: "jane.d@synergy.com", expertise: "Data Science", interns: 2, avatar: "https://placehold.co/100x100.png" },
  { id: 3, name: "John Smith", email: "john.s@synergy.com", expertise: "Mobile Development", interns: 2, avatar: "https://placehold.co/100x100.png" },
  { id: 4, name: "Emily White", email: "emily.w@synergy.com", expertise: "UI/UX Design", interns: 2, avatar: "https://placehold.co/100x100.png" },
  { id: 5, name: "Michael Green", email: "michael.g@synergy.com", expertise: "Cloud Architecture", interns: 2, avatar: "https://placehold.co/100x100.png" },
  { id: 6, name: "Sarah Black", email: "sarah.b@synergy.com", expertise: "Backend Systems", interns: 0, avatar: "https://placehold.co/100x100.png" },
  { id: 7, name: "David King", email: "david.k@synergy.com", expertise: "DevOps", interns: 0, avatar: "https://placehold.co/100x100.png" },
  { id: 8, name: "Laura Hill", email: "laura.h@synergy.com", expertise: "Product Management", interns: 0, avatar: "https://placehold.co/100x100.png" },
  { id: 9, name: "Kevin Scott", email: "kevin.s@synergy.com", expertise: "Cybersecurity", interns: 0, avatar: "https://placehold.co/100x100.png" },
  { id: 10, name: "Olivia Adams", email: "olivia.a@synergy.com", expertise: "Frontend Development", interns: 0, avatar: "https://placehold.co/100x100.png" },
];

export default function MentorsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mentor Management</CardTitle>
                <CardDescription>View and manage all mentors.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mentor</TableHead>
                            <TableHead>Expertise</TableHead>
                            <TableHead className="text-center">Interns Assigned</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mentors.map((mentor) => (
                            <TableRow key={mentor.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint="avatar person" />
                                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{mentor.name}</p>
                                            <p className="text-sm text-muted-foreground">{mentor.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{mentor.expertise}</TableCell>
                                <TableCell className="text-center">{mentor.interns}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
