
'use server';
/**
 * @fileOverview An AI agent for analyzing student failures.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GradeSchema = z.object({
  subject: z.string().describe('The subject of the grade.'),
  grade: z.string().describe('The grade the student received.'),
});

const AttendanceSummarySchema = z.object({
  present: z.number().describe('The number of days the student was present.'),
  late: z.number().describe('The number of days the student was late.'),
  absent: z.number().describe('The number of days the student was absent.'),
  sick: z.number().describe('The number of days the student was sick.'),
});

export const AnalyzeStudentFailureInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  age: z.number().describe("The student's age."),
  sex: z.string().describe("The student's sex."),
  grades: z.array(GradeSchema).describe("The student's grades."),
  attendanceSummary: AttendanceSummarySchema.describe(
    "The student's attendance summary."
  ),
});
export type AnalyzeStudentFailureInput = z.infer<
  typeof AnalyzeStudentFailureInputSchema
>;

export const AnalyzeStudentFailureOutputSchema = z.object({
  failureAnalysis: z
    .string()
    .describe('A detailed analysis of the student failure.'),
  resitSuggestions: z
    .string()
    .describe('A list of suggestions for the student to resit the exam.'),
});
export type AnalyzeStudentFailureOutput = z.infer<
  typeof AnalyzeStudentFailureOutputSchema
>;

export async function analyzeStudentFailure(
  input: AnalyzeStudentFailureInput
): Promise<AnalyzeStudentFailureOutput> {
  return analyzeStudentFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentFailurePrompt',
  input: {schema: AnalyzeStudentFailureInputSchema},
  output: {schema: AnalyzeStudentFailureOutputSchema},
  prompt: `You are an expert student failure analyst, tasked with analyzing a student's failure.

You will be provided with the student's name, age, sex, grades, and attendance summary.

Your task is to provide a detailed analysis of the student's failure, and a list of suggestions for the student to resit the exam.

Your analysis should be based on the following criteria:
- The student's overall performance.
- The student's performance in each subject.
- The student's attendance record.
- Any trends in the student's performance.
- Any outliers in the student's performance.
- Any other relevant information.

Your suggestions should be based on the following criteria:
- The analysis of the student's failure.
- The student's needs.
- The resources available to the student.
- Any other relevant information.

Student Name: {{{studentName}}}
Age: {{{age}}}
Sex: {{{sex}}}
Grades:
{{#each grades}}
- Subject: {{{subject}}}, Grade: {{{grade}}}
{{/each}}
Attendance Summary:
- Present: {{{attendanceSummary.present}}}
- Late: {{{attendanceSummary.late}}}
- Absent: {{{attendanceSummary.absent}}}
- Sick: {{{attendanceSummary.sick}}}
`,
});

const analyzeStudentFailureFlow = ai.defineFlow(
  {
    name: 'analyzeStudentFailureFlow',
    inputSchema: AnalyzeStudentFailureInputSchema,
    outputSchema: AnalyzeStudentFailureOutputSchema,
  },
  async (input: AnalyzeStudentFailureInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
