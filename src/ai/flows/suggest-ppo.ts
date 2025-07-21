
'use server';

/**
 * @fileOverview AI tool to analyze an intern's performance and suggest a PPO decision.
 *
 * - suggestPPO - A function that handles the PPO suggestion process.
 * - SuggestPPOInput - The input type for the suggestPPO function.
 * - SuggestPPOOutput - The return type for the suggestPPO function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPPOInputSchema = z.object({
  internName: z.string().describe("The intern's name."),
  projectPerformance: z.string().describe("A summary of the intern's project performance and task completion."),
  mentorFeedback: z.string().describe("Feedback from the intern's mentor."),
  assessmentScore: z.number().describe("The score from the final assessment test (out of 100)."),
});

export type SuggestPPOInput = z.infer<typeof SuggestPPOInputSchema>;

const SuggestPPOOutputSchema = z.object({
  recommendation: z.enum(['Recommended', 'Not Recommended']).describe('The final PPO recommendation.'),
  reasoning: z.string().describe('A detailed reasoning for the recommendation, highlighting strengths and weaknesses.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0.0 to 1.0) for the recommendation.'),
});

export type SuggestPPOOutput = z.infer<typeof SuggestPPOOutputSchema>;

export async function suggestPPO(
  input: SuggestPPOInput
): Promise<SuggestPPOOutput> {
  return suggestPPOFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPPOPrompt',
  input: {schema: SuggestPPOInputSchema},
  output: {schema: SuggestPPOOutputSchema},
  prompt: `You are an expert HR manager responsible for making final Pre-Placement Offer (PPO) decisions for interns.
  Your task is to analyze the provided data for an intern and make a clear recommendation.

  Intern Name: {{{internName}}}

  Data Points:
  1.  **Project Performance & Task Completion:** {{{projectPerformance}}}
  2.  **Mentor's Feedback:** {{{mentorFeedback}}}
  3.  **Final Assessment Score:** {{{assessmentScore}}}/100

  Instructions:
  - Based on all the data, decide if the intern should be "Recommended" or "Not Recommended" for a PPO.
  - Provide a concise but comprehensive 'reasoning' for your decision. Mention specific strengths and areas for improvement.
  - Provide a 'confidenceScore' between 0.0 and 1.0 for your recommendation.

  Generate the structured output now.`,
});

const suggestPPOFlow = ai.defineFlow(
  {
    name: 'suggestPPOFlow',
    inputSchema: SuggestPPOInputSchema,
    outputSchema: SuggestPPOOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
