
'use server';
/**
 * @fileOverview An AI flow to analyze the performance of the entire school system.
 *
 * - analyzeSchoolSystem - A function that handles the system-wide analysis.
 * - AnalyzeSchoolSystemInput - The input type for the analyzeSchoolSystem function.
 * - AnalyzeSchoolSystemOutput - The return type for the analyzeSchoolSystem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchoolDataSchema = z.object({
    name: z.string().describe('The name of the school.'),
    tier: z.string().optional().describe('The subscription tier of the school (e.g., Premium, Pro, Starter).'),
    studentCount: z.number().describe('The total number of students in the school.'),
    teacherCount: z.number().describe('The total number of teachers in the school.'),
    averageGpa: z.number().describe('The average GPA of all students in the school.'),
    totalRevenue: z.number().describe('The total revenue collected by the school.'),
    overdueFees: z.number().describe('The total amount of overdue fees.'),
});

const AnalyzeSchoolSystemInputSchema = z.object({
  schools: z.array(SchoolDataSchema).describe('An array of data for each school in the system.'),
});
export type AnalyzeSchoolSystemInput = z.infer<typeof AnalyzeSchoolSystemInputSchema>;

const AnalyzeSchoolSystemOutputSchema = z.object({
  overallAnalysis: z.string().describe('A high-level analysis of the entire school system, identifying cross-school trends, top performers, and schools needing attention.'),
  recommendations: z.string().describe('A bulleted list of actionable recommendations for system-wide improvements or for specific schools.'),
});
export type AnalyzeSchoolSystemOutput = z.infer<typeof AnalyzeSchoolSystemOutputSchema>;

export async function analyzeSchoolSystem(input: AnalyzeSchoolSystemInput): Promise<AnalyzeSchoolSystemOutput> {
  return analyzeSchoolSystemFlow(input);
}

const analyzeSchoolSystemFlow = ai.defineFlow({
  name: 'analyzeSchoolSystemFlow',
  inputSchema: AnalyzeSchoolSystemInputSchema,
  outputSchema: AnalyzeSchoolSystemOutputSchema,
}, async (input) => {
    const prompt = ai.definePrompt({
      name: 'analyzeSchoolSystemPrompt',
      input: {schema: AnalyzeSchoolSystemInputSchema},
      output: {schema: AnalyzeSchoolSystemOutputSchema},
      prompt: `You are an expert educational consultant and data analyst for the EduManage platform. The developer, acting as a successful education advisor, needs a high-level overview of the entire network of schools.

        Analyze the following data from all schools in the system. Your goal is to identify system-wide trends, compare schools, and provide strategic recommendations.

        **School Data:**
        {{#each schools}}
        - **School:** {{{name}}} ({{tier}} Tier)
          - Students: {{studentCount}}
          - Teachers: {{teacherCount}}
          - Average GPA: {{averageGpa}}
          - Total Revenue: \${{totalRevenue}}
          - Overdue Fees: \${{overdueFees}}
        {{/each}}

        **Your Tasks:**
        1.  **Overall Analysis:** Provide a concise analysis of the system's health. Identify the top-performing schools based on a mix of academic (GPA) and financial (low overdue fees) health. Point out any schools that might be struggling in certain areas. Note the subscription tier in your analysis where relevant (e.g., a Premium school might have access to more resources). Are there any interesting correlations, e.g., between teacher-student ratio and GPA?
        2.  **Recommendations:** Based on your analysis, provide a bulleted list of actionable recommendations. These could be system-wide (e.g., "Implement a professional development program for teachers in schools with lower GPAs") or school-specific (e.g., "Suggest that Northwood High's administration focuses on improving fee collection strategies.").
      `,
    });

    const {output} = await prompt(input);
    return output!;
});
