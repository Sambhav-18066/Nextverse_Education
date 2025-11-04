'use server';

/**
 * @fileOverview Generates a quiz from a YouTube video transcript.
 *
 * - generateQuizFromTranscript - A function that generates a quiz from a YouTube video transcript.
 * - GenerateQuizFromTranscriptInput - The input type for the generateQuizFromTranscript function.
 * - GenerateQuizFromTranscriptOutput - The return type for the generateQuizFromTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTranscriptInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the YouTube video.'),
});
export type GenerateQuizFromTranscriptInput = z.infer<
  typeof GenerateQuizFromTranscriptInputSchema
>;

const GenerateQuizFromTranscriptOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz based on the transcript.'),
});
export type GenerateQuizFromTranscriptOutput = z.infer<
  typeof GenerateQuizFromTranscriptOutputSchema
>;

export async function generateQuizFromTranscript(
  input: GenerateQuizFromTranscriptInput
): Promise<GenerateQuizFromTranscriptOutput> {
  return generateQuizFromTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTranscriptPrompt',
  input: {schema: GenerateQuizFromTranscriptInputSchema},
  output: {schema: GenerateQuizFromTranscriptOutputSchema},
  prompt: `You are an expert in creating quizzes from transcripts.

  Generate a quiz based on the following transcript.

  Transcript: {{{transcript}}}
  `,
});

const generateQuizFromTranscriptFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTranscriptFlow',
    inputSchema: GenerateQuizFromTranscriptInputSchema,
    outputSchema: GenerateQuizFromTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
