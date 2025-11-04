'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating summaries of YouTube video transcripts.
 *
 * The flow takes a video transcript as input and returns a concise summary.
 *
 * @module src/ai/flows/generate-video-summary
 *
 * @interface GenerateVideoSummaryInput - The input type for the generateVideoSummary function.
 * @interface GenerateVideoSummaryOutput - The output type for the generateVideoSummary function.
 * @function generateVideoSummary - A function that handles the video summary generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoSummaryInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the YouTube video to summarize.'),
});

export type GenerateVideoSummaryInput = z.infer<
  typeof GenerateVideoSummaryInputSchema
>;

const GenerateVideoSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video transcript.'),
});

export type GenerateVideoSummaryOutput = z.infer<
  typeof GenerateVideoSummaryOutputSchema
>;

export async function generateVideoSummary(
  input: GenerateVideoSummaryInput
): Promise<GenerateVideoSummaryOutput> {
  return generateVideoSummaryFlow(input);
}

const generateVideoSummaryPrompt = ai.definePrompt({
  name: 'generateVideoSummaryPrompt',
  input: {schema: GenerateVideoSummaryInputSchema},
  output: {schema: GenerateVideoSummaryOutputSchema},
  prompt: `Summarize the following YouTube video transcript:\n\n{{transcript}}`,
});

const generateVideoSummaryFlow = ai.defineFlow(
  {
    name: 'generateVideoSummaryFlow',
    inputSchema: GenerateVideoSummaryInputSchema,
    outputSchema: GenerateVideoSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateVideoSummaryPrompt(input);
    return output!;
  }
);
