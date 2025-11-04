
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
  summary: z
    .string()
    .describe('The summary of the YouTube video.'),
});
export type GenerateQuizFromTranscriptInput = z.infer<
  typeof GenerateQuizFromTranscriptInputSchema
>;

const GenerateQuizFromTranscriptOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz based on the summary.'),
});
export type GenerateQuizFromTranscriptOutput = z.infer<
  typeof GenerateQuizFromTranscriptOutputSchema
>;

export async function generateQuizFromTranscript(
  input: GenerateQuizFromTranscriptInput
): Promise<GenerateQuizFromTranscriptOutput> {
  return generateQuizFromTranscriptFlow(input);
}

const generateQuizFromTranscriptFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTranscriptFlow',
    inputSchema: GenerateQuizFromTranscriptInputSchema,
    outputSchema: GenerateQuizFromTranscriptOutputSchema,
  },
  async input => {
    const quizPrompt = `You are an expert in creating quizzes from video summaries.

    Generate a multiple-choice quiz with exactly 5 questions.
    Each question must have 4 options, labeled A, B, C, and D.
    After each question's options, you MUST provide the correct answer on a new line.
    
    The format for the answer MUST BE EXACTLY: "Answer: [Correct Option Text]". Do not use the letter.

    Here is an example of the required format for one question:
    1. What is the main principle of wave-particle duality?
    A. Particles are always waves.
    B. Particles can exhibit properties of both waves and particles.
    C. Waves are always particles.
    D. It is not a real principle.
    Answer: Particles can exhibit properties of both waves and particles.
  
    Now, generate the full 5-question quiz based on this summary:
    Summary: ${input.summary}
    `;

    try {
        const {output} = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: quizPrompt,
            output: {
                schema: GenerateQuizFromTranscriptOutputSchema,
            },
            config: {
              temperature: 0.3
            }
        });
        return output!;
    } catch(e) {
        console.warn('Primary model (gemini-2.5-flash) failed, trying failsafe model (gemini-1.5-pro)...', e);
        const {output} = await ai.generate({
            model: 'googleai/gemini-1.5-pro',
            prompt: quizPrompt,
            output: {
                schema: GenerateQuizFromTranscriptOutputSchema,
            }
        });
        return output!;
    }
  }
);
