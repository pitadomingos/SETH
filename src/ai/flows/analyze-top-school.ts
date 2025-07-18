
'use server';
/**
 * @fileOverview An AI agent for analyzing top-performing schools.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeTopSchoolInputSchema = z.object({
  schoolName: z.string().describe("The school's name."),
  studentCount: z.number().describe("The number of students at the school."),
  averageGpa: z.number().describe('The average GPA of the school.'),
  feeCollectionRate: z
    .number()
    .describe('The fee collection rate of the school.'),
  overdueFees: z.number().describe('The total overdue fees of the school.'),
  avgTeacherPerformanceScore: z
    .number()
    .describe('The average teacher performance score of the school.'),
});
export type AnalyzeTopSchoolInput = z.infer<typeof AnalyzeTopSchoolInputSchema>;

export const AnalyzeTopSchoolOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the school.'),
  keyStrengths: z
    .array(z.string())
    .describe('A list of key strengths of the school.'),
});
export type AnalyzeTopSchoolOutput = z.infer<
  typeof AnalyzeTopSchoolOutputSchema
>;

export async function analyzeTopSchool(
  input: AnalyzeTopSchoolInput
): Promise<AnalyzeTopSchoolOutput> {
  return analyzeTopSchoolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTopSchoolPrompt',
  input: {schema: AnalyzeTopSchoolInputSchema},
  output: {schema: AnalyzeTopSchoolOutputSchema},
  prompt: `You are an expert school analyst, tasked with analyzing a top-performing school.

You will be provided with the school's name, student count, average GPA, fee collection rate, total overdue fees, and average teacher performance score.

Your task is to provide a detailed analysis of the school, and a list of key strengths of the school.

Your analysis should be based on the following criteria:
- The school's overall performance.
- The school's academic performance.
- The school's financial performance.
- The school's teacher performance.
- Any other relevant information.

Your list of key strengths should be based on the following criteria:
- The analysis of the school.
- The school's unique characteristics.
- Any other relevant information.

School Name: {{{schoolName}}}
Student Count: {{{studentCount}}}
Average GPA: {{{averageGpa}}}
Fee Collection Rate: {{{feeCollectionRate}}}
Overdue Fees: {{{overdueFees}}}
Average Teacher Performance Score: {{{avgTeacherPerformanceScore}}}
`,
});

const analyzeTopSchoolFlow = ai.defineFlow(
  {
    name: 'analyzeTopSchoolFlow',
    inputSchema: AnalyzeTopSchoolInputSchema,
    outputSchema: AnalyzeTopSchoolOutputSchema,
  },
  async (input: AnalyzeTopSchoolInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
