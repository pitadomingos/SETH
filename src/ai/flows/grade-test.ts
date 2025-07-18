
'use server';
/**
 * @fileOverview An AI agent for grading tests.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string().describe('The text of the question.'),
  options: z.array(z.string()).describe('The options for the question.'),
  correctAnswer: z.string().describe('The correct answer for the question.'),
});

export const GradeStudentTestInputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The questions for the test.'),
  studentAnswers: z
    .record(z.string())
    .describe('The student answers for the test.'),
});
export type GradeStudentTestInput = z.infer<typeof GradeStudentTestInputSchema>;

export const GradeStudentTestOutputSchema = z.object({
  score: z.number().describe('The score of the test.'),
  feedback: z.string().describe('The feedback for the test.'),
});
export type GradeStudentTestOutput = z.infer<
  typeof GradeStudentTestOutputSchema
>;

export async function gradeStudentTest(
  input: GradeStudentTestInput
): Promise<GradeStudentTestOutput> {
  return gradeStudentTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeTestPrompt',
  input: {schema: GradeStudentTestInputSchema},
  output: {schema: GradeStudentTestOutputSchema},
  prompt: `You are an expert test grader, tasked with grading a test.

You will be provided with the questions, and the student's answers.

Your task is to grade the test, and provide a score and feedback.

The test should be graded based on the following criteria:
- The correctness of the student's answers.
- The student's understanding of the material.
- Any other relevant information.

Questions:
{{#each questions}}
- Question: {{{questionText}}}
- Options:
{{#each options}}
- {{{this}}}
{{/each}}
- Correct Answer: {{{correctAnswer}}}
{{/each}}
Student Answers:
{{{studentAnswers}}}
`,
});

const gradeStudentTestFlow = ai.defineFlow(
  {
    name: 'gradeStudentTestFlow',
    inputSchema: GradeStudentTestInputSchema,
    outputSchema: GradeStudentTestOutputSchema,
  },
  async (input: GradeStudentTestInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
