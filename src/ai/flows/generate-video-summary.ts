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
  summary: z
    .string()
    .describe('A detailed and comprehensive summary of the video transcript, highlighting key points.'),
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
  prompt: `Generate a detailed and comprehensive summary of the following YouTube video transcript. Make sure to highlight any particularly important points or "serious notes" that are critical for understanding the topic.

Transcript:
{{{transcript}}}`,
});

const generateVideoSummaryFlow = ai.defineFlow(
  {
    name: 'generateVideoSummaryFlow',
    inputSchema: GenerateVideoSummaryInputSchema,
    outputSchema: GenerateVideoSummaryOutputSchema,
  },
  async input => {
    try {
      // First attempt with the primary model
      const {output} = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: `Generate a detailed and comprehensive summary of the following YouTube video transcript. Make sure to highlight any particularly important points or "serious notes" that are critical for understanding the topic.

Transcript:
${input.transcript}`,
        output: {
          schema: GenerateVideoSummaryOutputSchema,
        },
        config: {
          temperature: 0.5,
        }
      });
      return output!;
    } catch (error) {
      console.warn('Primary model (gemini-1.5-flash) failed, trying failsafe model (gemini-pro)...', error);
      // Failsafe: attempt with the secondary model
      const {output} = await ai.generate({
          model: 'googleai/gemini-pro',
          prompt: `Generate a detailed and comprehensive summary of the following YouTube video transcript. Make sure to highlight any particularly important points or "serious notes" that are critical for understanding the topic.

Transcript:
${input.transcript}`,
          output: {
              schema: GenerateVideoSummaryOutputSchema,
          }
      });
      return output!;
    }
  }
);
