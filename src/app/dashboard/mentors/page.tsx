
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getAllMentors } from "@/lib/actions";
import { MentorsTable } from "./MentorsTable";


export default async function MentorsPage() {
    const initialMentors = await getAllMentors();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mentor Management</CardTitle>
                <CardDescription>View and manage all mentors.</CardDescription>
            </CardHeader>
            <CardContent>
                <MentorsTable initialMentors={initialMentors} />
            </CardContent>
        </Card>
    );
}
