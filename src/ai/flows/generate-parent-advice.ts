
'use server';
/**
 * @fileOverview A parent advice generation AI agent.
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

export const GenerateParentAdviceInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  grades: z.array(GradeSchema).describe("The student's grades."),
  attendanceSummary: AttendanceSummarySchema.describe(
    "The student's attendance summary."
  ),
});
export type GenerateParentAdviceInput = z.infer<
  typeof GenerateParentAdviceInputSchema
>;

export const GenerateParentAdviceOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the student performance and recommendations.'),
  strengths: z.string().describe('A list of strengths of the student.'),
  recommendations: z.string().describe('A list of recommendations for the parent.'),
});
export type GenerateParentAdviceOutput = z.infer<
  typeof GenerateParentAdviceOutputSchema
>;

export async function generateParentAdvice(
  input: GenerateParentAdviceInput
): Promise<GenerateParentAdviceOutput> {
  return generateParentAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateParentAdvicePrompt',
  input: {schema: GenerateParentAdviceInputSchema},
  output: {schema: GenerateParentAdviceOutputSchema},
  prompt: `You are an expert school counselor, tasked with generating advice for parents.

You will be provided with the student's name, grades, and attendance summary.

Your task is to provide a summary of the student's performance, a list of the student's strengths, and a list of recommendations for the parent.

Your advice should be based on the following criteria:
- The student's overall performance.
- The student's performance in each subject.
- The student's attendance record.
- Any trends in the student's performance.
- Any outliers in the student's performance.
- Any other relevant information.

Student Name: {{{studentName}}}
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

const generateParentAdviceFlow = ai.defineFlow(
  {
    name: 'generateParentAdviceFlow',
    inputSchema: GenerateParentAdviceInputSchema,
    outputSchema: GenerateParentAdviceOutputSchema,
  },
  async (input: GenerateParentAdviceInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
