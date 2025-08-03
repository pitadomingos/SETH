'use server';
/**
 * @fileOverview An AI flow for generating weekly lesson plans.
 * 
 * - generateLessonPlan - Generates a lesson plan based on subject, grade, and performance.
 * - GenerateLessonPlanParams - Input type for the lesson plan generation.
 * - LessonPlan - Output type for the generated lesson plan.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLessonPlanParamsSchema = z.object({
  subject: z.string().describe("The subject for the lesson plan (e.g., Mathematics, History)."),
  grade: z.string().describe("The grade level for the lesson plan (e.g., '10', '5')."),
  syllabusTopics: z.array(z.string()).describe("A list of topics from the official syllabus for this subject and grade."),
  recentStudentPerformance: z.array(z.object({
    studentName: z.string(),
    grade: z.string(),
    description: z.string(),
  })).describe("A summary of recent student performance, including grades and the assignment/test description."),
});
export type GenerateLessonPlanParams = z.infer<typeof GenerateLessonPlanParamsSchema>;

const DailyPlanSchema = z.object({
  day: z.string().describe("The day of the week (e.g., Monday, Tuesday)."),
  topic: z.string().describe("The specific topic for the day."),
  objective: z.string().describe("The learning objective for the day's lesson."),
  activities: z.array(z.string()).describe("A list of activities for the lesson, in sequential order."),
  assessment: z.string().describe("How student understanding will be assessed for the day."),
});

const LessonPlanSchema = z.object({
  title: z.string().describe("A creative and engaging title for the week's lesson plan."),
  weeklyObjectives: z.array(z.string()).describe("A list of 2-3 high-level learning objectives for the entire week."),
  materialsNeeded: z.array(z.string()).describe("A list of materials needed for the week's lessons."),
  dailyPlans: z.array(DailyPlanSchema).length(5).describe("An array of 5 daily lesson plans, one for each day from Monday to Friday."),
});
export type LessonPlan = z.infer<typeof LessonPlanSchema>;

export async function generateLessonPlan(params: GenerateLessonPlanParams): Promise<LessonPlan> {
  return lessonPlannerFlow(params);
}

const lessonPlannerPrompt = ai.definePrompt({
  name: 'lessonPlannerPrompt',
  input: { schema: GenerateLessonPlanParamsSchema },
  output: { schema: LessonPlanSchema },
  prompt: `
    You are an expert curriculum developer and master teacher for Grade {{grade}} {{subject}}.
    Your task is to create a comprehensive, engaging, and performance-aware weekly lesson plan.

    **Context:**
    - **Subject:** {{subject}}
    - **Grade Level:** {{grade}}
    - **Syllabus Topics:** You should draw from these topics to structure the week.
      {{#each syllabusTopics}}
      - {{{this}}}
      {{/each}}
    
    **Student Performance Data:**
    Here is a summary of recent student performance in this subject. Pay close attention to areas where students struggled. You must design activities and objectives that directly address these weaknesses while also reinforcing strengths.
      {{#each recentStudentPerformance}}
      - Student: {{studentName}}, Grade: {{grade}} on "{{description}}"
      {{/each}}

    **Instructions:**
    1.  Create a 5-day lesson plan (Monday to Friday).
    2.  The plan must be logically sequenced, with each day building on the previous one.
    3.  Incorporate a variety of teaching methods, including direct instruction, group work, individual practice, and technology integration where appropriate.
    4.  **Crucially**, ensure the daily activities and objectives are tailored to address the performance data. For example, if many students performed poorly on an algebra test, dedicate more time to practice and re-teaching those concepts.
    5.  The assessment for each day should be practical and directly measure the stated objective.
    6.  The plan should be detailed enough for a substitute teacher to follow.
  `,
});

const lessonPlannerFlow = ai.defineFlow(
  {
    name: 'lessonPlannerFlow',
    inputSchema: GenerateLessonPlanParamsSchema,
    outputSchema: LessonPlanSchema,
  },
  async (params) => {
    const { output } = await lessonPlannerPrompt(params);
    if (!output) {
      throw new Error('Failed to generate a lesson plan from the AI model.');
    }
    return output;
  }
);
