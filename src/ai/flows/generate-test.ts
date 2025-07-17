
'use server';

/**
 * @fileOverview AI flow for generating a multiple-choice test.
 *
 * - generateTest - A function that handles the test generation process.
 * - GenerateTestInput - The input type for the generateTest function.
 * - GenerateTestOutput - The return type for the generateTest function.
 */

import {configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateTestInputSchema = z.object({
  subject: z.string().describe('The subject of the test.'),
  topic: z.string().describe('The specific topic within the subject for the test, based on the official school syllabus.'),
  gradeLevel: z.string().describe('The grade level for which the test is intended.'),
  numQuestions: z.coerce.number().int().min(1).max(10).describe('The number of questions to generate (1-10).'),
});
export type GenerateTestInput = z.infer<typeof GenerateTestInputSchema>;

const QuestionSchema = z.object({
  questionText: z.string().describe('The full text of the question.'),
  options: z.array(z.string()).length(4).describe('An array of exactly four possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const GenerateTestOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated test questions.'),
});
export type GenerateTestOutput = z.infer<typeof GenerateTestOutputSchema>;


export async function generateTest(input: GenerateTestInput): Promise<GenerateTestOutput> {
  const ai = configureGenkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'generateTestPrompt',
    input: {schema: GenerateTestInputSchema},
    output: {schema: GenerateTestOutputSchema},
    prompt: `You are an expert curriculum designer and teacher. Your task is to generate a multiple-choice test based on the user's specifications, using the school's official syllabus as a guide for the question content.

  Subject: {{{subject}}}
  Topic (from syllabus): {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Number of Questions: {{{numQuestions}}}

  Generate a test with exactly {{{numQuestions}}} questions. The questions should be about the specified 'Topic'.
  
  Each question must:
  1. Have exactly four plausible options.
  2. Have a single, unambiguously correct answer.
  3. Be appropriate for the specified grade level.
  4. Test the student's understanding of the topic based on a standard curriculum.

  Ensure the 'correctAnswer' field's value is an exact match to one of the strings in the 'options' array.
  `,
  });

  const {output} = await prompt(input);
  return output!;
}
