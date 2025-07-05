
'use server';
/**
 * @fileOverview An AI flow to grade a student's multiple-choice test.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
});

export const GradeStudentTestInputSchema = z.object({
  subject: z.string().describe('The subject of the test.'),
  topic: z.string().describe('The topic of the test.'),
  questions: z.array(QuestionSchema).describe('The array of test questions, including correct answers.'),
  studentAnswers: z.record(z.string()).describe("A map of student's answers, where the key is the question index (as a string) and the value is the selected option."),
});
export type GradeStudentTestInput = z.infer<typeof GradeStudentTestInputSchema>;

export const GradeStudentTestOutputSchema = z.object({
  score: z.number().describe('The final calculated score for the student, scaled to be out of 20.'),
  correctCount: z.number().describe('The total number of correctly answered questions.'),
  totalQuestions: z.number().describe('The total number of questions in the test.'),
});
export type GradeStudentTestOutput = z.infer<typeof GradeStudentTestOutputSchema>;

export async function gradeStudentTest(input: GradeStudentTestInput): Promise<GradeStudentTestOutput> {
  return gradeStudentTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeStudentTestPrompt',
  input: {schema: GradeStudentTestInputSchema},
  output: {schema: GradeStudentTestOutputSchema},
  prompt: `You are an automated test grading assistant for the EduManage platform. Your task is to grade a student's multiple-choice test based on the provided questions, correct answers, and the student's submission.

  The grading scale is 0-20. You must calculate the final score by scaling the number of correct answers to this 20-point scale.
  For example:
  - If there are 10 questions, each correct answer is worth 2 points.
  - If there are 5 questions, each correct answer is worth 4 points.
  - If there are 8 questions, each correct answer is worth 2.5 points.

  Here is the test information:
  Subject: {{{subject}}}
  Topic: {{{topic}}}

  Questions and Correct Answers:
  {{#each questions}}
  - Question {{../@index}}: {{this.questionText}}
    - Correct Answer: {{this.correctAnswer}}
  {{/each}}

  Student's Submitted Answers:
  {{#each studentAnswers}}
  - Question {{@key}}: {{this}}
  {{/each}}

  Please perform the following steps:
  1. Compare the student's answer for each question with the correct answer.
  2. Count the total number of correct answers.
  3. Calculate the final score out of 20 based on the number of correct answers and the total number of questions.
  4. Return the final score, the count of correct answers, and the total number of questions in the specified JSON format.
  `,
});

const gradeStudentTestFlow = ai.defineFlow(
  {
    name: 'gradeStudentTestFlow',
    inputSchema: GradeStudentTestInputSchema,
    outputSchema: GradeStudentTestOutputSchema,
  },
  async (input) => {
    // A simple JS implementation would be faster, but the user requested AI grading.
    // This flow directly calls the LLM as requested.
    const {output} = await prompt(input);
    return output!;
  }
);
