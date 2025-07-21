'use server';
/**
 * @fileOverview A flow to generate personalized advice for parents based on student data.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StudentGradeSchema = z.object({
  subject: z.string(),
  grade: z.string(),
});

const AttendanceSummarySchema = z.object({
  present: z.number(),
  late: z.number(),
  absent: z.number(),
  sick: z.number(),
});

export const GenerateParentAdviceInputSchema = z.object({
  studentName: z.string().describe("The name of the student."),
  grades: z.array(StudentGradeSchema).describe("A list of the student's recent grades."),
  attendanceSummary: AttendanceSummarySchema.describe("A summary of the student's attendance record."),
});
export type GenerateParentAdviceInput = z.infer<typeof GenerateParentAdviceInputSchema>;

export const GenerateParentAdviceOutputSchema = z.object({
  strengths: z.string().describe("A summary of the student's academic strengths, highlighting subjects where they are performing well."),
  areasForImprovement: z.string().describe("A gentle summary of subjects or areas where the student could improve, based on lower grades or attendance issues."),
  recommendations: z.string().describe("Actionable, supportive recommendations for the parent on how to help their child. This should include tips for creating a study environment, discussing challenges, and encouraging good habits."),
});
export type GenerateParentAdviceOutput = z.infer<typeof GenerateParentAdviceOutputSchema>;

const advicePrompt = ai.definePrompt({
  name: 'parentAdvicePrompt',
  input: { schema: GenerateParentAdviceInputSchema },
  output: { schema: GenerateParentAdviceOutputSchema },
  prompt: `You are a helpful school guidance counselor providing advice to a parent about their child, {{studentName}}.
  
Analyze the following academic and attendance data.

Grades:
{{#each grades}}
- {{subject}}: {{grade}}
{{/each}}

Attendance Summary:
- Present: {{attendanceSummary.present}} days
- Late: {{attendanceSummary.late}} days
- Absent: {{attendanceSummary.absent}} days
- Sick: {{attendanceSummary.sick}} days

Based on this data, provide a concise and supportive summary for the parent.
1.  Identify the student's strengths.
2.  Gently point out areas for improvement.
3.  Give actionable recommendations for the parent.
Keep the tone positive and encouraging.`,
});

const generateParentAdviceFlow = ai.defineFlow(
  {
    name: 'generateParentAdviceFlow',
    inputSchema: GenerateParentAdviceInputSchema,
    outputSchema: GenerateParentAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await advicePrompt(input);
    return output!;
  }
);

export async function generateParentAdvice(input: GenerateParentAdviceInput): Promise<GenerateParentAdviceOutput> {
  return await generateParentAdviceFlow(input);
}
