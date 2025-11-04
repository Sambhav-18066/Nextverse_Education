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
import {defineModel, geminiPro, gemini15Flash} from '@genkit-ai/google-genai';


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

const gemini25Flash = defineModel(
    {
        name: 'googleai/gemini-2.5-flash',
        config: {
            temperature: 0.5,
        }
    },
    async (input) => {
        // This is a placeholder for any custom logic you might want to add.
        // For now, it just passes through to the gemini15Flash model.
        return gemini15Flash(input);
    }
)


const prompt = ai.definePrompt({
  name: 'generateQuizFromTranscriptPrompt',
  input: {schema: GenerateQuizFromTranscriptInputSchema},
  output: {schema: GenerateQuizFromTranscriptOutputSchema},
  prompt: `You are an expert in creating quizzes from video summaries.

  Generate a multiple-choice quiz with 4 options (A, B, C, D) and a clear answer key based on the following summary.
  Provide the question, the options, and then the correct answer on a new line starting with "Answer:".

  Summary: {{{summary}}}
  `,
});

const generateQuizFromTranscriptFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTranscriptFlow',
    inputSchema: GenerateQuizFromTranscriptInputSchema,
    outputSchema: GenerateQuizFromTranscriptOutputSchema,
  },
  async input => {
    const quizPrompt = `You are an expert in creating quizzes from video summaries.

    Generate a multiple-choice quiz with 4 options (A, B, C, D) and a clear answer key based on the following summary.
    Provide the question, the options, and then the correct answer on a new line starting with "Answer:".
  
    Summary: ${input.summary}
    `;

    try {
        const {output} = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: quizPrompt,
            output: {
                schema: GenerateQuizFromTranscriptOutputSchema,
            }
        });
        return output!;
    } catch(e) {
        console.warn('Primary model (gemini-2.5-flash) failed, trying failsafe model (gemini-pro)...', e);
        const {output} = await ai.generate({
            model: geminiPro,
            prompt: quizPrompt,
            output: {
                schema: GenerateQuizFromTranscriptOutputSchema,
            }
        });
        return output!;
    }
  }
);
