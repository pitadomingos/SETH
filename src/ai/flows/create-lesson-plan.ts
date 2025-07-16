// src/ai/flows/create-lesson-plan.ts
'use server';

/**
 * @fileOverview AI weekly lesson plan creation flow.
 *
 * - createLessonPlan - A function that handles the lesson plan creation process.
 * - CreateLessonPlanInput - The input type for the createLessonPlan function.
 * - CreateLessonPlanOutput - The return type for the createLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateLessonPlanInputSchema = z.object({
  className: z.string().describe('The name of the class for which the plan is being created (e.g., "Class 10-A").'),
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
  subject: z.string().describe('The subject for the lesson plan (e.g., "Mathematics").'),
  weeklySyllabus: z.string().describe('A summary of the topics to be covered during the week, based on the official curriculum.'),
  recentGrades: z.array(z.string()).describe('An array of recent student grades for this subject to gauge understanding (e.g., ["18", "12", "9", "20"]). The grading scale is 0-20, where <10 is failing.'),
});
export type CreateLessonPlanInput = z.infer<typeof CreateLessonPlanInputSchema>;

const DailyPlanSchema = z.object({
    day: z.string().describe("The day of the week (e.g., Monday)."),
    topic: z.string().describe("The main topic for the day, which can be a recap or a new topic from the syllabus."),
    isRecap: z.boolean().describe("Set to true if this day is primarily a recap of past material based on poor student performance."),
    objectives: z.string().describe("Bulleted list of learning objectives for the day."),
    activities: z.string().describe("Bulleted list of activities for the day's lesson (e.g., lecture, group work, quiz)."),
    materials: z.string().describe("Bulleted list of materials needed for the day's lesson (e.g., textbook pages, worksheets, lab equipment)."),
});

const CreateLessonPlanOutputSchema = z.object({
  weeklyPlan: z.array(DailyPlanSchema).length(5).describe("A 5-day lesson plan for the week, from Monday to Friday.")
});
export type CreateLessonPlanOutput = z.infer<typeof CreateLessonPlanOutputSchema>;

export async function createLessonPlan(input: CreateLessonPlanInput): Promise<CreateLessonPlanOutput> {
  return createLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createLessonPlanPrompt',
  input: {schema: CreateLessonPlanInputSchema},
  output: {schema: CreateLessonPlanOutputSchema},
  prompt: `You are an expert instructional designer and AI assistant for teachers. Your task is to create a detailed, performance-aware weekly lesson plan.

  **Context:**
  - Class: {{{className}}} ({{{gradeLevel}}})
  - Subject: {{{subject}}}
  - Weekly Syllabus/Topics: {{{weeklySyllabus}}}
  - Recent Student Grades (0-20 scale): {{#each recentGrades}}{{this}}, {{/each}}

  **Your Task:**

  1.  **Analyze Performance:** Review the "Recent Student Grades". The passing score is 10 out of 20. If a significant number of grades (e.g., more than 25-30%) are below 12, or if the average seems low, the students are struggling.
  
  2.  **Plan the Week:**
      *   **If students are struggling:** Dedicate Monday's lesson to a **recap** of prerequisite concepts related to this week's syllabus. Clearly label this day as a recap. Then, structure the remaining syllabus topics from Tuesday to Friday.
      *   **If students are performing well:** Proceed with the new syllabus topics for the entire week, starting from Monday.

  3.  **Generate the 5-Day Plan:** Create a structured plan for Monday through Friday. For each day, provide:
      *   **topic:** A clear topic for the lesson.
      *   **isRecap:** A boolean flag indicating if it's a recap day.
      *   **objectives:** What students should be able to do by the end of the lesson (use a bulleted list).
      *   **activities:** How the lesson will be taught (e.g., lecture, group discussion, hands-on activity, short quiz). Use a bulleted list.
      *   **materials:** What resources are needed (e.g., textbook chapters, worksheets, specific websites, equipment). Use a bulleted list.

  Ensure the entire output is a valid JSON object matching the provided schema, with a 'weeklyPlan' array containing exactly five daily plan objects.
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
