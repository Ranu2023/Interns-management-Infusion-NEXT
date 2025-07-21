
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, TrendingUp, Zap } from "lucide-react";

const feedbackItems = [
  { id: 1, mentor: "Dr. Guide", date: "2024-07-12", type: "Weekly Check-in", content: "Great progress on the chatbot's intent recognition this week. Your problem-solving skills are impressive. Suggestion: Try to write more detailed commit messages.", rating: 4, area: "Technical Skills" },
  { id: 2, mentor: "John Smith", date: "2024-07-10", type: "Code Review", content: "The component you built is clean and reusable. Good job on following the style guide. Let's work on adding more unit tests next.", rating: 5, area: "Code Quality" },
  { id: 3, mentor: "Dr. Guide", date: "2024-07-05", type: "Weekly Check-in", content: "Alice is proactive and asks thoughtful questions. Her communication is clear. She needs to improve her time estimation for tasks.", rating: 4, area: "Proactiveness" },
  { id: 4, mentor: "Jane Doe", date: "2024-06-28", type: "Project Update", content: "Showed a great demo of the data visualization. The insights were valuable. The presentation could be a bit more polished.", rating: 4, area: "Presentation" },
  { id: 5, mentor: "Dr. Guide", date: "2024-06-21", type: "Weekly Check-in", content: "Struggled a bit with the new library, but showed persistence and eventually figured it out. This resilience is a great trait.", rating: 3, area: "Problem Solving" },
  { id: 6, mentor: "Emily White", date: "2024-06-14", type: "Design Review", content: "Excellent contributions to the brainstorming session. The wireframes are creative and user-centric.", rating: 5, area: "Creativity" },
  { id: 7, mentor: "Dr. Guide", date: "2024-06-07", type: "Project Kick-off", content: "Started the project with a lot of enthusiasm. Eager to learn and contribute.", rating: 5, area: "Attitude" },
  { id: 8, mentor: "Michael Green", date: "2024-07-11", type: "Architecture Meeting", content: "Good understanding of the cloud services. Was able to explain complex concepts clearly to the team.", rating: 4, area: "Communication" },
  { id: 9, mentor: "Dr. Guide", date: "2024-07-01", type: "Performance Chat", content: "Consistently delivering high-quality work. A real asset to the team.", rating: 5, area: "Overall Performance" },
  { id: 10, mentor: "John Smith", date: "2024-06-18", type: "Code Review", content: "The code was well-structured, but missed a few edge cases. Remember to think about error handling more comprehensively.", rating: 3, area: "Attention to Detail" },
];

export default function MyFeedbackPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight font-headline">My Feedback</h1>
                <p className="text-muted-foreground">View feedback from your mentor and track your growth.</p>
            </div>
            <div className="space-y-6">
                {feedbackItems.map((item) => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://placehold.co/100x100.png" alt={item.mentor} data-ai-hint="avatar person" />
                                    <AvatarFallback>{item.mentor.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-semibold">{item.type} with {item.mentor}</CardTitle>
                                    <CardDescription className="text-xs">{item.date}</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted stroke-muted-foreground'}`} />
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="italic">"{item.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
