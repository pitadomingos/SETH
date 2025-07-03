'use server';

/**
 * @fileOverview AI flow for generating advice for parents.
 *
 * - generateParentAdvice - A function that handles the parent advice generation process.
 * - GenerateParentAdviceInput - The input type for the generateParentAdvice function.
 * - GenerateParentAdviceOutput - The return type for the generateParentAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateParentAdviceInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  grades: z.array(z.object({
    subject: z.string(),
    grade: z.string(),
  })).describe('A list of the student\'s recent grades.'),
  attendanceSummary: z.object({
    present: z.number(),
    late: z.number(),
    absent: z.number(),
  }).describe('A summary of the student\'s attendance.'),
});
export type GenerateParentAdviceInput = z.infer<typeof GenerateParentAdviceInputSchema>;

const GenerateParentAdviceOutputSchema = z.object({
  summary: z.string().describe('A brief, encouraging overall summary of the student\'s progress.'),
  strengths: z.string().describe('A bulleted list of the student\'s key strengths based on the data.'),
  recommendations: z.string().describe('A bulleted list of actionable recommendations for the parent to help their child improve or continue to succeed.'),
});
export type GenerateParentAdviceOutput = z.infer<typeof GenerateParentAdviceOutputSchema>;

export async function generateParentAdvice(input: GenerateParentAdviceInput): Promise<GenerateParentAdviceOutput> {
  return generateParentAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateParentAdvicePrompt',
  input: {schema: GenerateParentAdviceInputSchema},
  output: {schema: GenerateParentAdviceOutputSchema},
  prompt: `You are an experienced and encouraging educational counselor. A parent is asking for a summary of their child's recent performance.
  
  Analyze the provided data for the student, named {{{studentName}}}.
  
  Recent Grades:
  {{#each grades}}
  - Subject: {{subject}}, Grade: {{grade}}
  {{/each}}
  
  Attendance Summary:
  - Present: {{attendanceSummary.present}} days
  - Late: {{attendanceSummary.late}} days
  - Absent: {{attendanceSummary.absent}} days
  
  Based on this data, provide a helpful, positive, and actionable report for the parent. Be encouraging and focus on constructive advice.
  
  Structure your response in three parts:
  1. A brief, encouraging overall summary.
  2. A bulleted list of key strengths.
  3. A bulleted list of actionable recommendations for the parent.
  `,
});

const generateParentAdviceFlow = ai.defineFlow(
  {
    name: 'generateParentAdviceFlow',
    inputSchema: GenerateParentAdviceInputSchema,
    outputSchema: GenerateParentAdviceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
