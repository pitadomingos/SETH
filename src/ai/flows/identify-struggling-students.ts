
'use server';
/**
 * @fileOverview An AI agent for identifying struggling students.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GradeSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  grade: z.number().describe('The grade the student received.'),
});

export const IdentifyStrugglingStudentsInputSchema = z.object({
  grades: z.array(GradeSchema).describe("The list of all students' grades."),
});
export type IdentifyStrugglingStudentsInput = z.infer<
  typeof IdentifyStrugglingStudentsInputSchema
>;

export const IdentifyStrugglingStudentsOutputSchema = z.object({
  strugglingStudents: z
    .array(
      z.object({
        studentId: z.string().describe('The ID of the struggling student.'),
        averageGrade: z.number().describe("The student's average grade."),
        reason: z.string().describe('The reason for identifying the student.'),
      })
    )
    .describe('A list of students who are struggling.'),
});
export type IdentifyStrugglingStudentsOutput = z.infer<
  typeof IdentifyStrugglingStudentsOutputSchema
>;

export async function identifyStrugglingStudents(
  input: IdentifyStrugglingStudentsInput
): Promise<IdentifyStrugglingStudentsOutput> {
  return identifyStrugglingStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyStrugglingStudentsPrompt',
  input: {schema: IdentifyStrugglingStudentsInputSchema},
  output: {schema: IdentifyStrugglingStudentsOutputSchema},
  prompt: `You are an expert student performance analyst, tasked with identifying struggling students.

You will be provided with a list of all students' grades.

Your task is to identify students who are struggling based on the following criteria:
- Consistently low grades.
- A significant drop in grades.
- Any other patterns that indicate a student may need help.

For each struggling student, provide their ID, average grade, and a brief reason for flagging them.
`,
});

const identifyStrugglingStudentsFlow = ai.defineFlow(
  {
    name: 'identifyStrugglingStudentsFlow',
    inputSchema: IdentifyStrugglingStudentsInputSchema,
    outputSchema: IdentifyStrugglingStudentsOutputSchema,
  },
  async (input: IdentifyStrugglingStudentsInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
