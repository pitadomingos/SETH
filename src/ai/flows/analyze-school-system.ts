
'use server';
/**
 * @fileOverview A school system analysis AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchoolAnalysisSchema = z.object({
  name: z.string().describe('The name of the school.'),
  tier: z.string().describe('The subscription tier of the school.'),
  studentCount: z.number().describe('The number of students in the school.'),
  teacherCount: z.number().describe('The number of teachers in the school.'),
  averageGpa: z
    .number()
    .describe('The average GPA of the students in the school.'),
  totalRevenue: z.number().describe('The total revenue of the school.'),
  overdueFees: z
    .number()
    .describe('The total overdue fees of the school.'),
});
type SchoolAnalysis = z.infer<typeof SchoolAnalysisSchema>;

export const AnalyzeSchoolSystemInputSchema = z.object({
  schools: z.array(SchoolAnalysisSchema).describe('The schools to analyze.'),
});
export type AnalyzeSchoolSystemInput = z.infer<
  typeof AnalyzeSchoolSystemInputSchema
>;

export const AnalyzeSchoolSystemOutputSchema = z.object({
  overallAnalysis: z
    .string()
    .describe('A detailed analysis of the school system.'),
  recommendations: z
    .string()
    .describe(
      'A list of recommendations for the school system, in a bulleted list.'
    ),
});
export type AnalyzeSchoolSystemOutput = z.infer<
  typeof AnalyzeSchoolSystemOutputSchema
>;

export async function analyzeSchoolSystem(
  input: AnalyzeSchoolSystemInput
): Promise<AnalyzeSchoolSystemOutput> {
  return analyzeSchoolSystemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSchoolSystemPrompt',
  input: {schema: AnalyzeSchoolSystemInputSchema},
  output: {schema: AnalyzeSchoolSystemOutputSchema},
  prompt: `You are an expert school system analyst, tasked with analyzing a school system.

You will be provided with a list of schools to analyze.

Your task is to provide a detailed analysis of the school system, and a list of recommendations for the school system.

Your analysis should be based on the following criteria:
- The overall performance of the school system.
- The distribution of schools by tier.
- The distribution of students by school.
- The distribution of teachers by school.
- The distribution of revenue by school.
- Any trends in the data.
- Any outliers in the data.
- Any other relevant information.

Your recommendations should be based on the following criteria:
- The analysis of the school system.
- The needs of the schools in the system.
- The resources available to the school system.
- Any other relevant information.

Schools:
{{#each schools}}
- Name: {{{name}}}
- Tier: {{{tier}}}
- Students: {{{studentCount}}}
- Teachers: {{{teacherCount}}}
- Average GPA: {{{averageGpa}}}
- Total Revenue: {{{totalRevenue}}}
- Overdue Fees: {{{overdueFees}}}
{{/each}}`,
});

const analyzeSchoolSystemFlow = ai.defineFlow(
  {
    name: 'analyzeSchoolSystemFlow',
    inputSchema: AnalyzeSchoolSystemInputSchema,
    outputSchema: AnalyzeSchoolSystemOutputSchema,
  },
  async (input: AnalyzeSchoolSystemInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
