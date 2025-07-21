'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  suggestInternImprovements,
  type SuggestInternImprovementsOutput,
} from '@/ai/flows/suggest-intern-improvements';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AiInsightsPage() {
  const [feedback, setFeedback] = useState('');
  const [dailyReports, setDailyReports] = useState('');
  const [result, setResult] = useState<SuggestInternImprovementsOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!feedback || !dailyReports) {
        setError("Both feedback and daily reports fields are required.");
        return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await suggestInternImprovements({ feedback, dailyReports });
      setResult(output);
    } catch (e) {
      setError('An error occurred while generating suggestions.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          AI-Driven Intern Insights
        </h1>
        <p className="text-muted-foreground">
          Analyze feedback and reports to generate actionable suggestions.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>
              Provide the intern's feedback and daily reports below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="feedback">Intern Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="e.g., The intern is proactive but struggles with time management..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="text-base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="daily-reports">Daily Reports</Label>
              <Textarea
                id="daily-reports"
                placeholder="e.g., Day 1: Completed tutorial. Day 2: Worked on feature X..."
                value={dailyReports}
                onChange={(e) => setDailyReports(e.target.value)}
                rows={10}
                className="text-base"
              />
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Analyzing...' : 'Generate Suggestions'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <Card className="flex items-center justify-center min-h-[300px]">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Analyzing and generating insights...</p>
                </div>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  Based on the provided information, here are some areas for development:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>AI-Generated Suggestion</AlertTitle>
                  <AlertDescription className="prose dark:prose-invert max-w-none text-base">
                    {result.suggestions}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
