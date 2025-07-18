
'use server';
/**
 * @fileOverview An AI agent for analyzing top-performing students.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GradeSchema = z.object({
  subject: z.string().describe('The subject of the grade.'),
  grade: z.string().describe('The grade the student received.'),
});

const BehavioralAssessmentSchema = z.object({
  date: z.string().describe('The date of the assessment.'),
  teacherId: z.string().describe('The ID of the teacher who made the assessment.'),
  respect: z.number().describe('The respect rating.'),
  participation: z.number().describe('The participation rating.'),
  socialSkills: z.number().describe('The social skills rating.'),
  conduct: z.number().describe('The conduct rating.'),
  comment: z.string().describe('The comment for the assessment.'),
});

export const AnalyzeTopStudentInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  schoolName: z.string().describe("The student's school name."),
  grade: z.string().describe("The student's grade."),
  averageGrade: z.number().describe("The student's average grade."),
  grades: z.array(GradeSchema).describe("The student's grades."),
  attendanceRate: z.number().describe("The student's attendance rate."),
  behavioralAssessments: z.array(BehavioralAssessmentSchema).describe("The student's behavioral assessments."),
});
export type AnalyzeTopStudentInput = z.infer<typeof AnalyzeTopStudentInputSchema>;

export const AnalyzeTopStudentOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the student.'),
  keyStrengths: z
    .array(z.string())
    .describe('A list of key strengths of the student.'),
});
export type AnalyzeTopStudentOutput = z.infer<
  typeof AnalyzeTopStudentOutputSchema
>;

export async function analyzeTopStudent(
  input: AnalyzeTopStudentInput
): Promise<AnalyzeTopStudentOutput> {
  return analyzeTopStudentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTopStudentPrompt',
  input: {schema: AnalyzeTopStudentInputSchema},
  output: {schema: AnalyzeTopStudentOutputSchema},
  prompt: `You are an expert student analyst, tasked with analyzing a top-performing student.

You will be provided with the student's name, school name, grade, average grade, grades, attendance rate, and behavioral assessments.

Your task is to provide a detailed analysis of the student, and a list of key strengths of the student.

Your analysis should be based on the following criteria:
- The student's overall performance.
- The student's academic performance.
- The student's attendance record.
- The student's behavioral assessments.
- Any other relevant information.

Your list of key strengths should be based on the following criteria:
- The analysis of the student.
- The student's unique characteristics.
- Any other relevant information.

Student Name: {{{studentName}}}
School Name: {{{schoolName}}}
Grade: {{{grade}}}
Average Grade: {{{averageGrade}}}
Grades:
{{#each grades}}
- Subject: {{{subject}}}, Grade: {{{grade}}}
{{/each}}
Attendance Rate: {{{attendanceRate}}}
Behavioral Assessments:
{{#each behavioralAssessments}}
- Respect: {{{respect}}}, Participation: {{{participation}}}, Social Skills: {{{socialSkills}}}, Conduct: {{{conduct}}}
{{/each}}
`,
});

const analyzeTopStudentFlow = ai.defineFlow(
  {
    name: 'analyzeTopStudentFlow',
    inputSchema: AnalyzeTopStudentInputSchema,
    outputSchema: AnalyzeTopStudentOutputSchema,
  },
  async (input: AnalyzeTopStudentInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
