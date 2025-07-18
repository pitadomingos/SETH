
'use server';
/**
 * @fileOverview An AI agent for analyzing top-performing teachers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassPerformanceSchema = z.object({
  className: z.string().describe('The name of the class.'),
  averageGrade: z.number().describe('The average grade of the class.'),
  passingRate: z.number().describe('The passing rate of the class.'),
});

export const AnalyzeTopTeacherInputSchema = z.object({
  teacherName: z.string().describe("The teacher's name."),
  schoolName: z.string().describe("The teacher's school name."),
  subject: z.string().describe("The teacher's subject."),
  averageStudentGrade: z.number().describe("The teacher's average student grade."),
  classPerformances: z.array(ClassPerformanceSchema).describe("The teacher's class performances."),
});
export type AnalyzeTopTeacherInput = z.infer<typeof AnalyzeTopTeacherInputSchema>;

export const AnalyzeTopTeacherOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the teacher.'),
  keyMetrics: z
    .array(z.string())
    .describe('A list of key metrics of the teacher.'),
});
export type AnalyzeTopTeacherOutput = z.infer<
  typeof AnalyzeTopTeacherOutputSchema
>;

export async function analyzeTopTeacher(
  input: AnalyzeTopTeacherInput
): Promise<AnalyzeTopTeacherOutput> {
  return analyzeTopTeacherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTopTeacherPrompt',
  input: {schema: AnalyzeTopTeacherInputSchema},
  output: {schema: AnalyzeTopTeacherOutputSchema},
  prompt: `You are an expert teacher analyst, tasked with analyzing a top-performing teacher.

You will be provided with the teacher's name, school name, subject, average student grade, and class performances.

Your task is to provide a detailed analysis of the teacher, and a list of key metrics of the teacher.

Your analysis should be based on the following criteria:
- The teacher's overall performance.
- The teacher's academic performance.
- The teacher's class performances.
- Any other relevant information.

Your list of key metrics should be based on the following criteria:
- The analysis of the teacher.
- The teacher's unique characteristics.
- Any other relevant information.

Teacher Name: {{{teacherName}}}
School Name: {{{schoolName}}}
Subject: {{{subject}}}
Average Student Grade: {{{averageStudentGrade}}}
Class Performances:
{{#each classPerformances}}
- Class Name: {{{className}}}, Average Grade: {{{averageGrade}}}, Passing Rate: {{{passingRate}}}
{{/each}}
`,
});

const analyzeTopTeacherFlow = ai.defineFlow(
  {
    name: 'analyzeTopTeacherFlow',
    inputSchema: AnalyzeTopTeacherInputSchema,
    outputSchema: AnalyzeTopTeacherOutputSchema,
  },
  async (input: AnalyzeTopTeacherInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
