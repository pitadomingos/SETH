
'use server';
/**
 * @fileOverview A teacher performance analysis AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeTeacherPerformanceInputSchema = z.object({
  teacherName: z.string().describe("The teacher's name."),
  grades: z
    .array(z.number())
    .describe("The grades of the teacher's students."),
});
export type AnalyzeTeacherPerformanceInput = z.infer<
  typeof AnalyzeTeacherPerformanceInputSchema
>;

export const AnalyzeTeacherPerformanceOutputSchema = z.object({
  performanceScore: z
    .number()
    .describe('The performance score of the teacher.'),
  analysis: z.string().describe('A detailed analysis of the teacher.'),
});
export type AnalyzeTeacherPerformanceOutput = z.infer<
  typeof AnalyzeTeacherPerformanceOutputSchema
>;

export async function analyzeTeacherPerformance(
  input: AnalyzeTeacherPerformanceInput
): Promise<AnalyzeTeacherPerformanceOutput> {
  return analyzeTeacherPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTeacherPerformancePrompt',
  input: {schema: AnalyzeTeacherPerformanceInputSchema},
  output: {schema: AnalyzeTeacherPerformanceOutputSchema},
  prompt: `You are an expert teacher performance analyst, tasked with analyzing a teacher's performance.

You will be provided with the teacher's name and a list of their students' grades.

Your task is to provide a performance score for the teacher, and a detailed analysis of their performance.

Your analysis should be based on the following criteria:
- The overall performance of the teacher's students.
- The distribution of grades.
- Any trends in the grades.
- Any outliers in the grades.
- Any other relevant information.

Teacher Name: {{{teacherName}}}
Grades:
{{#each grades}}
- {{{this}}}
{{/each}}
`,
});

const analyzeTeacherPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeTeacherPerformanceFlow',
    inputSchema: AnalyzeTeacherPerformanceInputSchema,
    outputSchema: AnalyzeTeacherPerformanceOutputSchema,
  },
  async (input: AnalyzeTeacherPerformanceInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
