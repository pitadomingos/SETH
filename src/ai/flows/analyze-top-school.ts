'use server';
/**
 * @fileOverview An AI flow to analyze why a school is a top performer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTopSchoolInputSchema = z.object({
  schoolName: z.string().describe("The name of the school."),
  studentCount: z.number().describe("The total number of students."),
  averageGpa: z.number().describe("The school-wide average GPA."),
  feeCollectionRate: z.number().describe("The fee collection rate as a percentage."),
  overdueFees: z.number().describe("The total amount of overdue fees."),
  avgTeacherPerformanceScore: z.number().describe("The average performance score of teachers at the school."),
});
type AnalyzeTopSchoolInput = z.infer<typeof AnalyzeTopSchoolInputSchema>;

const AnalyzeTopSchoolOutputSchema = z.object({
  analysis: z.string().describe("A detailed, celebratory analysis explaining why this school excels. Mention specific metrics like high GPA, strong financial health (high fee collection), and teacher quality. Use a professional and congratulatory tone."),
  keyStrengths: z.array(z.string()).describe("A bulleted list of 3-4 key strengths that contributed to the school's success."),
});
type AnalyzeTopSchoolOutput = z.infer<typeof AnalyzeTopSchoolOutputSchema>;


export async function analyzeTopSchool(input: AnalyzeTopSchoolInput): Promise<AnalyzeTopSchoolOutput> {
  return analyzeTopSchoolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTopSchoolPrompt',
  input: {schema: AnalyzeTopSchoolInputSchema},
  output: {schema: AnalyzeTopSchoolOutputSchema},
  prompt: `You are an expert educational analyst writing a citation for an award-winning school.
  
  School Name: {{{schoolName}}}
  
  Metrics:
  - Student Population: {{studentCount}}
  - Average GPA: {{averageGpa}}
  - Fee Collection Rate: {{feeCollectionRate}}%
  - Overdue Fees: \${{overdueFees}}
  - Average Teacher Score: {{avgTeacherPerformanceScore}}/100

  Based on these outstanding metrics, write a detailed analysis celebrating why {{{schoolName}}} is a top-performing institution.

  - Start with a congratulatory opening.
  - Highlight their academic excellence, pointing to the high GPA.
  - Comment on their operational and financial stability, evidenced by the strong fee collection rate.
  - Mention the quality of the teaching staff, as shown by their high average performance score.
  - Conclude by summarizing their key strengths in a bulleted list.
  - The tone should be formal and celebratory.
  `,
});

const analyzeTopSchoolFlow = ai.defineFlow(
  {
    name: 'analyzeTopSchoolFlow',
    inputSchema: AnalyzeTopSchoolInputSchema,
    outputSchema: AnalyzeTopSchoolOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
