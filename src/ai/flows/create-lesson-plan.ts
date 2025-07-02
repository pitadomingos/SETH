// src/ai/flows/create-lesson-plan.ts
'use server';

/**
 * @fileOverview AI lesson plan creation flow.
 *
 * - createLessonPlan - A function that handles the lesson plan creation process.
 * - CreateLessonPlanInput - The input type for the createLessonPlan function.
 * - CreateLessonPlanOutput - The return type for the createLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateLessonPlanInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson plan.'),
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
});
export type CreateLessonPlanInput = z.infer<typeof CreateLessonPlanInputSchema>;

const CreateLessonPlanOutputSchema = z.object({
  objectives: z.string().describe('The learning objectives for the lesson.'),
  activities: z.string().describe('The activities for the lesson.'),
  materials: z.string().describe('The materials needed for the lesson.'),
});
export type CreateLessonPlanOutput = z.infer<typeof CreateLessonPlanOutputSchema>;

export async function createLessonPlan(input: CreateLessonPlanInput): Promise<CreateLessonPlanOutput> {
  return createLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createLessonPlanPrompt',
  input: {schema: CreateLessonPlanInputSchema},
  output: {schema: CreateLessonPlanOutputSchema},
  prompt: `You are an AI assistant designed to help teachers create lesson plans.

  Based on the topic and grade level provided, generate a lesson plan including objectives, activities, and materials.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  `,
});

const createLessonPlanFlow = ai.defineFlow(
  {
    name: 'createLessonPlanFlow',
    inputSchema: CreateLessonPlanInputSchema,
    outputSchema: CreateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
