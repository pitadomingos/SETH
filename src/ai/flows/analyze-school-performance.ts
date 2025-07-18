
'use server';
/**
 * @fileOverview A school performance analysis AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeSchoolPerformanceInputSchema = z.object({
  studentCount: z.number().describe('The total number of students.'),
  teacherCount: z.number().describe('The total number of teachers.'),
  annualRevenue: z.number().describe('The total annual revenue.'),
});
export type AnalyzeSchoolPerformanceInput = z.infer<
  typeof AnalyzeSchoolPerformanceInputSchema
>;

export const AnalyzeSchoolPerformanceOutputSchema = z.object({
  analysis: z
    .string()
    .describe('A detailed analysis of the school performance.'),
});
export type AnalyzeSchoolPerformanceOutput = z.infer<
  typeof AnalyzeSchoolPerformanceOutputSchema
>;

export async function analyzeSchoolPerformance(
  input: AnalyzeSchoolPerformanceInput
): Promise<AnalyzeSchoolPerformanceOutput> {
  return analyzeSchoolPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSchoolPerformancePrompt',
  input: {schema: AnalyzeSchoolPerformanceInputSchema},
  output: {schema: AnalyzeSchoolPerformanceOutputSchema},
  prompt: `You are an expert school performance analyst, tasked with analyzing a school's overall performance.

You will be provided with the student count, teacher count, and annual revenue.

Your task is to provide a detailed analysis of the school's performance based on these metrics.

Student Count: {{{studentCount}}}
Teacher Count: {{{teacherCount}}}
Annual Revenue: {{{annualRevenue}}}
`,
});

const analyzeSchoolPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeSchoolPerformanceFlow',
    inputSchema: AnalyzeSchoolPerformanceInputSchema,
    outputSchema: AnalyzeSchoolPerformanceOutputSchema,
  },
  async (input: AnalyzeSchoolPerformanceInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
