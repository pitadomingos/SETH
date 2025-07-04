'use server';
/**
 * @fileOverview An AI flow to provide a holistic analysis of a school's performance.
 *
 * - analyzeSchoolPerformance - A function that handles the school-wide analysis.
 * - AnalyzeSchoolPerformanceInput - The input type for the function.
 * - AnalyzeSchoolPerformanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TeacherInfoSchema = z.object({
  name: z.string(),
  subject: z.string(),
  studentCount: z.number(),
  averageGrade: z.number(),
});

const SubjectInfoSchema = z.object({
  name: z.string(),
  averageGrade: z.number(),
  failureRate: z.number(),
});

const FinancialInfoSchema = z.object({
  totalRevenue: z.number(),
  totalFees: z.number(),
  collectionRate: z.number(),
  overdueAmount: z.number(),
});


const AnalyzeSchoolPerformanceInputSchema = z.object({
  schoolName: z.string().describe("The name of the school being analyzed."),
  teachers: z.array(TeacherInfoSchema).describe("Performance data for each teacher."),
  subjects: z.array(SubjectInfoSchema).describe("Performance data for each subject."),
  financials: FinancialInfoSchema.describe("The school's financial health data."),
  overallStudentCount: z.number().describe("Total number of students in the school."),
  overallAverageGrade: z.number().describe("The average grade across all students and subjects."),
});
export type AnalyzeSchoolPerformanceInput = z.infer<typeof AnalyzeSchoolPerformanceInputSchema>;

const KeyMetricSchema = z.object({
  name: z.string().describe("The name of the metric (e.g., 'Average Grade', 'Pass Rate %')."),
  value: z.number().describe("The value of the metric."),
  unit: z.string().optional().describe("The unit for the value (e.g., '%').")
});

const AnalyzeSchoolPerformanceOutputSchema = z.object({
  holisticAnalysis: z.string().describe("A comprehensive, multi-paragraph analysis covering academic, teacher, and financial performance. Identify strengths, weaknesses, and provide actionable recommendations."),
  keyMetrics: z.array(KeyMetricSchema).describe("An array of key performance indicators for charting."),
});
export type AnalyzeSchoolPerformanceOutput = z.infer<typeof AnalyzeSchoolPerformanceOutputSchema>;

export async function analyzeSchoolPerformance(input: AnalyzeSchoolPerformanceInput): Promise<AnalyzeSchoolPerformanceOutput> {
  return analyzeSchoolPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSchoolPerformancePrompt',
  input: {schema: AnalyzeSchoolPerformanceInputSchema},
  output: {schema: AnalyzeSchoolPerformanceOutputSchema},
  prompt: `You are an expert educational consultant and data analyst for a school named {{{schoolName}}}. Your task is to provide a holistic, high-level analysis of the school's overall performance based on the provided data.

**Academic Data:**
- Total Students: {{overallStudentCount}}
- School-Wide Average Grade: {{overallAverageGrade}}/20
- Subject Performance:
  {{#each subjects}}
  - {{name}}: Avg. Grade {{averageGrade}}/20, Failure Rate {{failureRate}}%
  {{/each}}

**Teacher Data:**
{{#each teachers}}
- {{name}} ({{subject}}): Avg. Grade {{averageGrade}}/20 for {{studentCount}} students.
{{/each}}

**Financial Data:**
- Total Billed Fees: \${{financials.totalFees}}
- Total Revenue Collected: \${{financials.totalRevenue}}
- Fee Collection Rate: {{financials.collectionRate}}%
- Overdue Fees: \${{financials.overdueAmount}}

**Analysis Task:**

1.  **Holistic Analysis:** Write a comprehensive analysis that synthesizes all the provided data.
    -   **Academics:** Comment on the overall average grade. Are there any subjects that are performing exceptionally well or poorly? Highlight any subjects with high failure rates.
    -   **Teachers:** Briefly comment on teacher performance. Are there any clear high-performers based on average grades?
    -   **Financials:** Analyze the financial health. How is the fee collection rate? Is the amount of overdue fees a concern?
    -   **Synthesis & Recommendations:** Conclude with a summary of the school's main strengths and areas needing attention. Provide 2-3 actionable recommendations. For example, if a subject has a high failure rate, suggest a curriculum review or teacher training. If fee collection is low, recommend a new payment follow-up strategy.

2.  **Key Metrics:** Extract three key metrics for a summary chart. These should be:
    -   The school-wide average grade (out of 20).
    -   The overall pass rate (calculated as 100 minus the average of all subject failure rates).
    -   The fee collection rate (%).
`,
});

const analyzeSchoolPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeSchoolPerformanceFlow',
    inputSchema: AnalyzeSchoolPerformanceInputSchema,
    outputSchema: AnalyzeSchoolPerformanceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
