'use server';
/**
 * @fileOverview An AI flow to analyze why a student is a top performer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeTopStudentInputSchema = z.object({
  studentName: z.string().describe("The name of the student."),
  schoolName: z.string().describe("The name of the student's school."),
  grade: z.string().describe("The student's grade level."),
  averageGrade: z.number().describe("The student's average grade (0-20 scale)."),
  grades: z.array(z.object({ subject: z.string(), grade: z.string() })).describe("A list of the student's grades in various subjects."),
  attendanceRate: z.number().describe("The student's overall attendance rate percentage."),
});
export type AnalyzeTopStudentInput = z.infer<typeof AnalyzeTopStudentInputSchema>;

export const AnalyzeTopStudentOutputSchema = z.object({
  analysis: z.string().describe("A detailed, celebratory analysis of the student's academic achievements. Mention their high average grade, consistency, and strong attendance. The tone should be encouraging and recognize their hard work."),
  keyStrengths: z.array(z.string()).describe("A bulleted list of 3-4 key strengths, such as 'Excellence in [Top Subject]' or 'High Dedication (based on attendance)'.")
});
export type AnalyzeTopStudentOutput = z.infer<typeof AnalyzeTopStudentOutputSchema>;


export async function analyzeTopStudent(input: AnalyzeTopStudentInput): Promise<AnalyzeTopStudentOutput> {
  return analyzeTopStudentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTopStudentPrompt',
  input: {schema: AnalyzeTopStudentInputSchema},
  output: {schema: AnalyzeTopStudentOutputSchema},
  prompt: `You are an academic advisor writing a profile for an award-winning student.
  
  Student Name: {{{studentName}}}
  School: {{{schoolName}}}
  Grade: {{{grade}}}
  
  Academic Data:
  - Average Grade: {{averageGrade}}/20
  - Attendance Rate: {{attendanceRate}}%
  - Recent Grades:
    {{#each grades}}
    - {{subject}}: {{grade}}
    {{/each}}

  Based on this data, write a celebratory analysis of why {{{studentName}}} is a top student.

  - Highlight their impressive overall average grade.
  - Identify their top-performing subject(s).
  - Note their excellent attendance rate as a sign of dedication.
  - Conclude with a bulleted list of their key strengths.
  - The tone should be positive and recognize the student's hard work and talent.
  `,
});

const analyzeTopStudentFlow = ai.defineFlow(
  {
    name: 'analyzeTopStudentFlow',
    inputSchema: AnalyzeTopStudentInputSchema,
    outputSchema: AnalyzeTopStudentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
