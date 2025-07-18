
'use server';
/**
 * @fileoverview A lesson plan creation AI agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CreateLessonPlanInputSchema = z.object({
  subject: z.string().describe('The subject of the lesson plan.'),
  gradeLevel: z.string().describe('The grade level of the lesson plan.'),
  weeklyTopic: z
    .string()
    .describe('The topic for the week from the syllabus.'),
  classPerformanceSummary: z
    .string()
    .describe('A summary of the class performance.'),
});
export type CreateLessonPlanInput = z.infer<
  typeof CreateLessonPlanInputSchema
>;

const WeeklyPlanSchema = z.object({
  weeklyTopic: z.string().describe('The topic for the week.'),
  learningObjectives: z
    .array(z.string())
    .describe('The learning objectives for the week.'),
  lessonActivities: z.array(
    z.object({
      day: z.string().describe('The day of the week.'),
      activity: z.string().describe('The activity for the day.'),
    })
  ),
  assessmentMethods: z
    .array(z.string())
    .describe('The assessment methods for the week.'),
});

export const CreateLessonPlanOutputSchema = z.object({
  weeklyPlan: WeeklyPlanSchema.describe('The weekly lesson plan.'),
});
export type CreateLessonPlanOutput = z.infer<
  typeof CreateLessonPlanOutputSchema
>;

export async function createLessonPlan(
  input: CreateLessonPlanInput
): Promise<CreateLessonPlanOutput> {
  return createLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createLessonPlanPrompt',
  input: {schema: CreateLessonPlanInputSchema},
  output: {schema: CreateLessonPlanOutputSchema},
  prompt: `You are an expert lesson planner, tasked with creating a weekly lesson plan.

You will be provided with the subject, grade level, weekly topic, and a summary of the class performance.

Your task is to create a detailed weekly lesson plan, including the weekly topic, learning objectives, lesson activities for each day of the week, and assessment methods.

Your lesson plan should be based on the following criteria:
- The subject and grade level.
- The weekly topic.
- The class performance summary.
- The needs of the students in the class.
- The resources available to the teacher.
- Any other relevant information.

Subject: {{{subject}}}
Grade Level: {{{gradeLevel}}}
Weekly Topic: {{{weeklyTopic}}}
Class Performance Summary: {{{classPerformanceSummary}}}
`,
});

const createLessonPlanFlow = ai.defineFlow(
  {
    name: 'createLessonPlanFlow',
    inputSchema: CreateLessonPlanInputSchema,
    outputSchema: CreateLessonPlanOutputSchema,
  },
  async (input: CreateLessonPlanInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
