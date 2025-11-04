'use server';

/**
 * @fileOverview This file defines a Genkit flow to enhance search queries using AI.
 *
 * It uses available courses to find the most relevant material even with spelling errors or partial topic names.
 * - enhanceSearch: The function to enhance the search query.
 * - EnhanceSearchInput: The input type for the enhanceSearch function.
 * - EnhanceSearchOutput: The output type for the enhanceSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSearchInputSchema = z.object({
  query: z.string().describe('The user search query.'),
  availableCourses: z.array(z.string()).describe('List of available course names.'),
});
export type EnhanceSearchInput = z.infer<typeof EnhanceSearchInputSchema>;

const EnhanceSearchOutputSchema = z.object({
  enhancedQuery: z.string().describe('The AI-enhanced search query.'),
});
export type EnhanceSearchOutput = z.infer<typeof EnhanceSearchOutputSchema>;

export async function enhanceSearch(input: EnhanceSearchInput): Promise<EnhanceSearchOutput> {
  return enhanceSearchFlow(input);
}

const enhanceSearchPrompt = ai.definePrompt({
  name: 'enhanceSearchPrompt',
  input: {schema: EnhanceSearchInputSchema},
  output: {schema: EnhanceSearchOutputSchema},
  prompt: `You are an AI assistant designed to enhance search queries for an educational platform.

The user is searching for courses using the following query: "{{query}}".

Here is a list of available course names: {{availableCourses}}.

Correct any spelling errors in the user's query and, using the list of available courses, determine the most relevant course names, even if the user's query only contains part of the topic name.
Return a new search query that includes the most relevant course names. Do not include courses that are not relevant.

Enhanced Query: `,
});

const enhanceSearchFlow = ai.defineFlow(
  {
    name: 'enhanceSearchFlow',
    inputSchema: EnhanceSearchInputSchema,
    outputSchema: EnhanceSearchOutputSchema,
  },
  async input => {
    const {output} = await enhanceSearchPrompt(input);
    return output!;
  }
);
