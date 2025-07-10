
'use server';
/**
 * @fileOverview An AI flow to analyze student failure and provide guidance.
 *
 * - analyzeStudentFailure - A function that handles the student failure analysis.
 * - AnalyzeStudentFailureInput - The input type for the analyzeStudentFailure function.
 * - AnalyzeStudentFailureOutput - The return type for the analyzeStudentFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentFailureInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  age: z.number().describe('The age of the student.'),
  sex: z.string().describe('The sex of the student (Male or Female).'),
  grades: z.array(z.object({
    subject: z.string(),
    grade: z.string(),
  })).describe('A list of the student\'s recent grades.'),
  attendanceSummary: z.object({
    present: z.number().describe("Total number of lessons marked 'Present'."),
    late: z.number().describe("Total number of lessons marked 'Late'."),
    absent: z.number().describe("Total number of lessons marked 'Absent'."),
    sick: z.number().optional().describe("Total number of lessons marked 'Sick'."),
  }).describe('A summary of the student\'s lesson attendance.'),
});
export type AnalyzeStudentFailureInput = z.infer<typeof AnalyzeStudentFailureInputSchema>;

const AnalyzeStudentFailureOutputSchema = z.object({
  failureAnalysis: z.string().describe('A concise, empathetic analysis identifying the primary reasons for the student not meeting passing requirements, based on grade and lesson attendance data.'),
  resitSuggestions: z.string().describe('A bulleted list of actionable, encouraging suggestions for how the student can prepare to re-sit their final exams.'),
});
export type AnalyzeStudentFailureOutput = z.infer<typeof AnalyzeStudentFailureOutputSchema>;

export async function analyzeStudentFailure(input: AnalyzeStudentFailureInput): Promise<AnalyzeStudentFailureOutput> {
  return analyzeStudentFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentFailurePrompt',
  input: {schema: AnalyzeStudentFailureInputSchema},
  output: {schema: AnalyzeStudentFailureOutputSchema},
  prompt: `You are a caring and insightful academic advisor. You are tasked with analyzing the record of a student named {{{studentName}}} who has not met the requirements for graduation.

Your goal is to provide a clear, supportive analysis of why they failed and give them concrete, encouraging steps to succeed when they re-sit their exams.

**Student Data:**
Student Name: {{{studentName}}}
Age: {{{age}}}
Sex: {{{sex}}}

**Grades:**
{{#each grades}}
- Subject: {{subject}}, Grade: {{grade}}
{{/each}}

**Lesson Attendance Summary:**
- Present: {{attendanceSummary.present}} lessons
- Late: {{attendanceSummary.late}} lessons
- Absent: {{attendanceSummary.absent}} lessons
{{#if attendanceSummary.sick}}
- Sick: {{attendanceSummary.sick}} lessons
{{/if}}

**Analysis Task:**
1.  **Analyze Failure:** Examine the grades and attendance. Consider the student's age and sex as context but do not focus on them unless it's highly relevant. Identify the key contributing factors. Is it poor performance in one specific, critical subject? Is it a general trend of low grades across the board? Does high lesson absenteeism or sickness correlate with poor grades in specific subjects?
2.  **Provide Suggestions:** Based on your analysis, provide a bulleted list of actionable suggestions. These should be practical and encouraging. For example, suggest focusing on specific subjects, seeking tutoring, improving study habits, creating a study schedule, or improving lesson attendance.

**Output Tone:**
- Be empathetic and supportive, not judgmental.
- Focus on future success.
- The language should be clear and easy for a student to understand.
`,
});

const analyzeStudentFailureFlow = ai.defineFlow(
  {
    name: 'analyzeStudentFailureFlow',
    inputSchema: AnalyzeStudentFailureInputSchema,
    outputSchema: AnalyzeStudentFailureOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
