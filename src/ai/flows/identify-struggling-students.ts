
'use server';
/**
 * @fileOverview An AI flow to identify students who are struggling academically.
 *
 * - identifyStrugglingStudents - A function that handles the student analysis.
 * - IdentifyStrugglingStudentsInput - The input type for the function.
 * - IdentifyStrugglingStudentsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentGradeInfoSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  grades: z.array(z.object({
    subject: z.string(),
    grade: z.string(),
  })).describe('A list of the student\'s recent grades.'),
});

const IdentifyStrugglingStudentsInputSchema = z.object({
  students: z.array(StudentGradeInfoSchema),
});
export type IdentifyStrugglingStudentsInput = z.infer<typeof IdentifyStrugglingStudentsInputSchema>;

const StrugglingStudentSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  reason: z.string().describe('A concise reason why the student is identified as struggling (e.g., "Low average grade", "Failing multiple core subjects").'),
  suggestedAction: z.string().describe('A brief, actionable suggestion for the administrator (e.g., "Schedule meeting with teacher", "Recommend academic counseling").'),
});

const IdentifyStrugglingStudentsOutputSchema = z.object({
  strugglingStudents: z.array(StrugglingStudentSchema).describe('A list of students identified as needing academic support.'),
});
export type IdentifyStrugglingStudentsOutput = z.infer<typeof IdentifyStrugglingStudentsOutputSchema>;

export async function identifyStrugglingStudents(input: IdentifyStrugglingStudentsInput): Promise<IdentifyStrugglingStudentsOutput> {
  return identifyStrugglingStudentsFlow(input);
}


const identifyStrugglingStudentsFlow = ai.defineFlow(
  {
    name: 'identifyStrugglingStudentsFlow',
    inputSchema: IdentifyStrugglingStudentsInputSchema,
    outputSchema: IdentifyStrugglingStudentsOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'identifyStrugglingStudentsPrompt',
      input: {schema: IdentifyStrugglingStudentsInputSchema},
      output: {schema: IdentifyStrugglingStudentsOutputSchema},
      prompt: `You are an expert educational analyst. Your task is to review a list of all students and their grades to identify those who are struggling academically. The grading scale is 0-20, where a grade below 10 is considered failing.

        Review the following student data:
        {{#each students}}
        - Student: {{{studentName}}} (ID: {{studentId}})
          Grades: 
          {{#each grades}}
            - {{subject}}: {{grade}}
          {{/each}}
        {{/each}}

        Identify students who meet one or more of the following criteria:
        - Failing (grade below 10) in two or more subjects.
        - An average grade across all subjects that is below 12.
        - A failing grade in a core subject like Mathematics or English.

        For each student you identify, provide a concise reason and a suggested next step for the school administrator. Compile this into a list. If no students are struggling, return an empty list.
      `,
    });

    const {output} = await prompt(input);
    return output!;
  }
);
