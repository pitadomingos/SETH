'use server';
/**
 * @fileOverview A flow to analyze why a student failed and provide suggestions.
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

export const AnalyzeStudentFailureInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  age: z.number().describe('The age of the student.'),
  sex: z.string().describe('The sex of the student.'),
  grades: z.array(StudentGradeSchema).describe("A list of the student's final grades for each subject."),
  attendanceSummary: AttendanceSummarySchema.describe('A summary of the student\'s attendance record.'),
});
export type AnalyzeStudentFailureInput = z.infer<typeof AnalyzeStudentFailureInputSchema>;

export const AnalyzeStudentFailureOutputSchema = z.object({
  failureAnalysis: z.string().describe('A comprehensive but empathetic analysis of the likely reasons the student failed to meet graduation requirements. This should consider grades and attendance. It should be written in a supportive tone, directly addressing the student.'),
  resitSuggestions: z.string().describe('Actionable suggestions for how the student can prepare for re-sit examinations. This should be encouraging and provide concrete steps.'),
});
export type AnalyzeStudentFailureOutput = z.infer<typeof AnalyzeStudentFailureOutputSchema>;

const analysisPrompt = ai.definePrompt({
    name: 'studentFailureAnalysisPrompt',
    input: { schema: AnalyzeStudentFailureInputSchema },
    output: { schema: AnalyzeStudentFailureOutputSchema },
    prompt: `You are an empathetic and experienced academic advisor. A student, {{studentName}} ({{age}}, {{sex}}), has not met the requirements for graduation. Your task is to analyze their record and provide supportive feedback.

Student's final grades:
{{#each grades}}
- {{subject}}: {{grade}}
{{/each}}

Attendance Summary:
- Present: {{attendanceSummary.present}} days
- Late: {{attendanceSummary.late}} days
- Absent: {{attendanceSummary.absent}} days
- Sick: {{attendanceSummary.sick}} days

Passing grade is 12/20.

Analyze the provided data to determine the likely reasons for failure. Consider both academic performance (which subjects were low-scoring) and attendance issues.

Then, generate a comprehensive analysis written in a supportive, encouraging, and non-judgmental tone directly to the student.

Finally, provide a set of actionable suggestions for how they can prepare for re-sit exams. Focus on study strategies, time management, and seeking help.`,
});

const analyzeStudentFailureFlow = ai.defineFlow(
  {
    name: 'analyzeStudentFailureFlow',
    inputSchema: AnalyzeStudentFailureInputSchema,
    outputSchema: AnalyzeStudentFailureOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);

export async function analyzeStudentFailure(input: AnalyzeStudentFailureInput): Promise<AnalyzeStudentFailureOutput> {
  return await analyzeStudentFailureFlow(input);
}
