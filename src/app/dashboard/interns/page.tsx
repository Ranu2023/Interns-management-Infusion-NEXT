
'use server';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getInternsForHR } from '@/lib/actions';
import { InternsTable } from "./InternsTable";

export default async function InternsPage() {
  const initialInterns = await getInternsForHR();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interns</CardTitle>
        <CardDescription>
          View and manage intern profiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <InternsTable initialInterns={initialInterns} />
      </CardContent>
    </Card>
  );
}
