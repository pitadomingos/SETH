
'use server';
/**
 * @fileOverview An AI flow to analyze a school's course schedule for conflicts.
 *
 * - analyzeScheduleConflicts - A function that handles the schedule analysis.
 * - AnalyzeScheduleConflictsInput - The input type for the function.
 * - AnalyzeScheduleConflictsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseScheduleInputSchema = z.object({
  subject: z.string(),
  teacherName: z.string(),
  className: z.string(),
  schedule: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    room: z.string(),
  })),
});

const AnalyzeScheduleConflictsInputSchema = z.object({
  courses: z.array(CourseScheduleInputSchema).describe("An array of all courses with their schedules to be analyzed."),
});
export type AnalyzeScheduleConflictsInput = z.infer<typeof AnalyzeScheduleConflictsInputSchema>;

const ConflictSchema = z.object({
  type: z.string().describe("The type of conflict (e.g., 'Teacher Conflict', 'Room Conflict')."),
  details: z.string().describe("A detailed description of the conflict, including the teacher/room, courses, and time slots involved."),
  suggestion: z.string().describe("A specific, actionable suggestion to resolve this conflict."),
});

const AnalyzeScheduleConflictsOutputSchema = z.object({
  hasConflicts: z.boolean().describe("A boolean flag that is true if any conflicts were found, otherwise false."),
  summary: z.string().describe("A high-level summary of the analysis results. States if conflicts were found or if the schedule is clear."),
  conflicts: z.array(ConflictSchema).describe("A list of all identified scheduling conflicts."),
});
export type AnalyzeScheduleConflictsOutput = z.infer<typeof AnalyzeScheduleConflictsOutputSchema>;

export async function analyzeScheduleConflicts(input: AnalyzeScheduleConflictsInput): Promise<AnalyzeScheduleConflictsOutput> {
  if (input.courses.length < 2) {
      return {
          hasConflicts: false,
          summary: "Not enough course data to analyze for conflicts.",
          conflicts: [],
      }
  }
  return analyzeScheduleConflictsFlow(input);
}


const analyzeScheduleConflictsFlow = ai.defineFlow(
  {
    name: 'analyzeScheduleConflictsFlow',
    inputSchema: AnalyzeScheduleConflictsInputSchema,
    outputSchema: AnalyzeScheduleConflictsOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'analyzeScheduleConflictsPrompt',
      input: {schema: AnalyzeScheduleConflictsInputSchema},
      output: {schema: AnalyzeScheduleConflictsOutputSchema},
      prompt: `You are an expert school administrator specializing in timetable and schedule management. Your task is to analyze a list of courses and their weekly schedules to identify any conflicts.

        A conflict occurs if the same teacher or the same room is scheduled for two different classes at the same overlapping time on the same day.

        Here is the schedule data to analyze:
        {{#each courses}}
        - Course: {{subject}} for {{className}} with {{teacherName}}
          Schedule:
          {{#each schedule}}
          - Day: {{day}}, Time: {{startTime}}-{{endTime}}, Room: {{room}}
          {{/each}}
        {{/each}}

        **Your Tasks:**

        1.  **Analyze the Schedule:** Carefully check for overlaps. A conflict exists if, for any given day:
            *   The same teacher is assigned to two different courses whose time slots overlap.
            *   The same room is assigned to two different courses whose time slots overlap.
            (e.g., 09:00-10:00 and 09:30-10:30 is an overlap).

        2.  **Summarize Findings:**
            *   If there are no conflicts, set 'hasConflicts' to false and provide a summary stating the schedule is clear.
            *   If conflicts are found, set 'hasConflicts' to true and provide a summary indicating the number and types of conflicts found.

        3.  **Detail Each Conflict:** For each conflict you identify, create a conflict object with:
            *   **type:** 'Teacher Conflict' or 'Room Conflict'.
            *   **details:** A clear explanation of the conflict (e.g., "Teacher John Doe is scheduled for Math (Class 10A) and Science (Class 10B) on Monday from 09:00-10:00.").
            *   **suggestion:** A practical suggestion to resolve it (e.g., "Suggest moving Science (Class 10B) to Room 202 or rescheduling it to 10:00-11:00.").

        Return the final analysis in the specified JSON format.
      `,
    });

    const {output} = await prompt(input);
    return output!;
  }
);
