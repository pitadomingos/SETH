
'use server';
/**
 * @fileOverview An AI agent for generating tests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateTestInputSchema = z.object({
  subject: z.string().describe('The subject of the test.'),
  topic: z.string().describe('The topic of the test.'),
  gradeLevel: z.string().describe('The grade level of the test.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateTestInput = z.infer<typeof GenerateTestInputSchema>;

export const GenerateTestOutputSchema = z.object({
  topic: z.string().describe('The topic of the test.'),
  questions: z
    .array(
      z.object({
        questionText: z.string().describe('The text of the question.'),
        options: z.array(z.string()).describe('The options for the question.'),
        correctAnswer: z
          .string()
          .describe('The correct answer for the question.'),
      })
    )
    .describe('The questions for the test.'),
});
export type GenerateTestOutput = z.infer<typeof GenerateTestOutputSchema>;

export async function generateTest(
  input: GenerateTestInput
): Promise<GenerateTestOutput> {
  return generateTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestPrompt',
  input: {schema: GenerateTestInputSchema},
  output: {schema: GenerateTestOutputSchema},
  prompt: `You are an expert test generator, tasked with generating a test.

You will be provided with the subject, topic, grade level, and number of questions.

Your task is to generate a test with the specified number of questions, each with a question text, a list of options, and the correct answer.

The test should be based on the following criteria:
- The subject and topic.
- The grade level.
- The number of questions.
- Any other relevant information.

Subject: {{{subject}}}
Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Number of Questions: {{{numQuestions}}}
`,
});

const generateTestFlow = ai.defineFlow(
  {
    name: 'generateTestFlow',
    inputSchema: GenerateTestInputSchema,
    outputSchema: GenerateTestOutputSchema,
  },
  async (input: GenerateTestInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
