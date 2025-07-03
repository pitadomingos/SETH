'use server';

/**
 * @fileOverview AI flow for generating a multiple-choice test.
 *
 * - generateTest - A function that handles the test generation process.
 * - GenerateTestInput - The input type for the generateTest function.
 * - GenerateTestOutput - The return type for the generateTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateTestInputSchema = z.object({
  subject: z.string().describe('The subject of the test.'),
  topic: z.string().describe('The specific topic within the subject for the test.'),
  gradeLevel: z.string().describe('The grade level for which the test is intended.'),
  numQuestions: z.coerce.number().int().min(1).max(10).describe('The number of questions to generate (1-10).'),
});
export type GenerateTestInput = z.infer<typeof GenerateTestInputSchema>;

const QuestionSchema = z.object({
  questionText: z.string().describe('The full text of the question.'),
  options: z.array(z.string()).length(4).describe('An array of exactly four possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

export const GenerateTestOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated test questions.'),
});
export type GenerateTestOutput = z.infer<typeof GenerateTestOutputSchema>;


export async function generateTest(input: GenerateTestInput): Promise<GenerateTestOutput> {
  return generateTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestPrompt',
  input: {schema: GenerateTestInputSchema},
  output: {schema: GenerateTestOutputSchema},
  prompt: `You are an expert curriculum designer and teacher. Your task is to generate a multiple-choice test based on the user's specifications.

  Subject: {{{subject}}}
  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Number of Questions: {{{numQuestions}}}

  Generate a test with exactly {{{numQuestions}}} questions. Each question must have exactly four options and you must clearly identify the single correct answer.
  The questions should be appropriate for the specified grade level and test the student's understanding of the topic.
  Ensure the 'correctAnswer' field's value is an exact match to one of the strings in the 'options' array.
  `,
});

const generateTestFlow = ai.defineFlow(
  {
    name: 'generateTestFlow',
    inputSchema: GenerateTestInputSchema,
    outputSchema: GenerateTestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
