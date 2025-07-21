
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mcqQuestions = [
  {
    id: 'q1',
    question: 'What is the primary function of a React component?',
    options: [
      'To store data in a database',
      'To manage application state',
      'To render UI elements',
      'To handle server-side logic',
    ],
    answer: 'To render UI elements',
  },
  {
    id: 'q2',
    question: 'Which hook is used to manage state in a functional component?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    answer: 'useState',
  },
  {
    id: 'q3',
    question: 'How do you pass data from a parent component to a child component?',
    options: ['Using state', 'Using context', 'Using props', 'Using refs'],
    answer: 'Using props',
  },
   {
    id: 'q4',
    question: 'What does CSS stand for?',
    options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
    answer: 'Cascading Style Sheets',
  },
   {
    id: 'q5',
    question: 'Which of the following is NOT a valid git command?',
    options: ['git commit', 'git push', 'git merge', 'git upload'],
    answer: 'git upload',
  },
];

export default function AssessmentPage() {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be submitted to a backend for grading.
    console.log('Submitted Answers:', answers);
    toast({
      title: 'Assessment Submitted!',
      description: 'Your assessment has been sent for review. Your mentor will update you with the results.',
    });
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Final Assessment
        </h1>
        <p className="text-muted-foreground">
          Demonstrate your knowledge and skills acquired during the internship.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Part 1: Multiple Choice Questions</CardTitle>
              <CardDescription>
                Select the best answer for each question.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {mcqQuestions.map((q, index) => (
                <div key={q.id}>
                  <p className="font-medium mb-4">
                    {index + 1}. {q.question}
                  </p>
                  <RadioGroup
                    value={answers[q.id]}
                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                  >
                    {q.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${q.id}-opt${i}`} />
                        <Label htmlFor={`${q.id}-opt${i}`} className="font-normal">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Part 2: Practical Task</CardTitle>
              <CardDescription>
                Complete the following task and push it to your repository.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">Task: Refactor a Component</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        Take the `MyProjects` component you worked on and refactor it to use a server-side data fetch instead of client-side state. Ensure it is performant and handles loading/error states gracefully.
                    </p>
                </div>
                 <div>
                    <h4 className="font-semibold">Requirements:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                        <li>Create a new branch named `final-assessment`.</li>
                        <li>Commit your changes with clear messages.</li>
                        <li>Push the branch to the remote repository.</li>
                        <li>Ensure the application runs without errors.</li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
               <div className="flex items-center text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>I have completed the practical task and pushed my code.</span>
                </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
