
'use server';
/**
 * @fileOverview A class performance analysis AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeClassPerformanceInputSchema = z.object({
  className: z.string().describe('The name of the class being analyzed.'),
  subject: z.string().describe('The subject being analyzed.'),
  grades: z
    .array(z.string())
    .describe('An array of student grades for the subject in this class.'),
  previousAnalysis: z
    .object({
      generatedAt: z
        .string()
        .describe(
          'The ISO 8601 timestamp of when the previous analysis was generated.'
        ),
      result: z.any().describe('The JSON result of the previous analysis.'),
    })
    .optional()
    .describe('The previous analysis, if any.'),
});
export type AnalyzeClassPerformanceInput = z.infer<
  typeof AnalyzeClassPerformanceInputSchema
>;

export const AnalyzeClassPerformanceOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the class performance.'),
  recommendation: z
    .string()
    .describe(
      'A recommendation for the teacher based on the class performance.'
    ),
  gradeDistribution: z.record(z.number()).describe('A distribution of grades (A, B, C, D, F).'),
  interventionNeeded: z
    .boolean()
    .describe(
      'Whether or not an intervention is needed for the class.'
    ),
});
export type AnalyzeClassPerformanceOutput = z.infer<
  typeof AnalyzeClassPerformanceOutputSchema
>;

export async function analyzeClassPerformance(
  input: AnalyzeClassPerformanceInput
): Promise<AnalyzeClassPerformanceOutput> {
  return analyzeClassPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeClassPerformancePrompt',
  input: {schema: AnalyzeClassPerformanceInputSchema},
  output: {schema: AnalyzeClassPerformanceOutputSchema},
  prompt: `You are an expert teacher's assistant, tasked with analyzing class performance.

You will be provided with the grades for a class, and an optional previous analysis.

Your task is to provide a detailed analysis of the class performance, a recommendation for the teacher, a grade distribution, and determine if an intervention is needed for the class.

Your analysis should be based on the following criteria:
- The overall performance of the class.
- The distribution of grades.
- Any trends in the grades.
- Any outliers in the grades.
- Any other relevant information.

Your recommendation should be based on the following criteria:
- The analysis of the class performance.
- The needs of the students in the class.
- The resources available to the teacher.
- Any other relevant information.

Class Name: {{{className}}}
Subject: {{{subject}}}
Grades: {{#each grades}}- {{{this}}}
{{/each}}
{{#if previousAnalysis}}Previous Analysis:
{{{previousAnalysis}}}
{{/if}}`,
});

const analyzeClassPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeClassPerformanceFlow',
    inputSchema: AnalyzeClassPerformanceInputSchema,
    outputSchema: AnalyzeClassPerformanceOutputSchema,
  },
  async (input: AnalyzeClassPerformanceInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
