'use server';

/**
 * @fileOverview AI tool to analyze intern feedback and daily reports to suggest areas for intern development and improvement.
 *
 * - suggestInternImprovements - A function that handles the suggestion generation process.
 * - SuggestInternImprovementsInput - The input type for the suggestInternImprovements function.
 * - SuggestInternImprovementsOutput - The return type for the suggestInternImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInternImprovementsInputSchema = z.object({
  feedback: z.string().describe('The feedback given to the intern.'),
  dailyReports: z.string().describe('The daily reports of the intern.'),
});

export type SuggestInternImprovementsInput = z.infer<
  typeof SuggestInternImprovementsInputSchema
>;

const SuggestInternImprovementsOutputSchema = z.object({
  suggestions: z.string().describe('The suggestions for intern development and improvement.'),
});

export type SuggestInternImprovementsOutput = z.infer<
  typeof SuggestInternImprovementsOutputSchema
>;

export async function suggestInternImprovements(
  input: SuggestInternImprovementsInput
): Promise<SuggestInternImprovementsOutput> {
  return suggestInternImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInternImprovementsPrompt',
  input: {schema: SuggestInternImprovementsInputSchema},
  output: {schema: SuggestInternImprovementsOutputSchema},
  prompt: `You are an AI assistant designed to analyze intern feedback and daily reports to suggest areas for intern development and improvement.

  Analyze the following feedback and daily reports to provide targeted guidance and enhance the internship program's effectiveness.

  Feedback: {{{feedback}}}
  Daily Reports: {{{dailyReports}}}

  Suggestions:`,
});

const suggestInternImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestInternImprovementsFlow',
    inputSchema: SuggestInternImprovementsInputSchema,
    outputSchema: SuggestInternImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
