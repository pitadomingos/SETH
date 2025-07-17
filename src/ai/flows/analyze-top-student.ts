
'use server';
/**
 * @fileOverview An AI flow to analyze why a student is a top performer.
 */

import {configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const AnalyzeTopStudentInputSchema = z.object({
  studentName: z.string().describe("The name of the student."),
  schoolName: z.string().describe("The name of the student's school."),
  grade: z.string().describe("The student's grade level."),
  averageGrade: z.number().describe("The student's average grade (0-20 scale)."),
  grades: z.array(z.object({ subject: z.string(), grade: z.string() })).describe("A list of the student's grades in various subjects."),
  attendanceRate: z.number().describe("The student's overall attendance rate percentage."),
  behavioralAssessments: z.array(z.object({
    date: z.date(),
    teacherId: z.string(),
    respect: z.number(),
    participation: z.number(),
    socialSkills: z.number(),
    conduct: z.number(),
    comment: z.string(),
  })).describe("A list of behavioral assessments from teachers (1-5 scale)."),
});
type AnalyzeTopStudentInput = z.infer<typeof AnalyzeTopStudentInputSchema>;

const AnalyzeTopStudentOutputSchema = z.object({
  analysis: z.string().describe("A detailed, celebratory analysis of the student's academic achievements. Mention their high average grade, consistency, strong attendance, and positive behavioral traits. The tone should be encouraging and recognize their hard work."),
  keyStrengths: z.array(z.string()).describe("A bulleted list of 3-4 key strengths, such as 'Excellence in [Top Subject]', 'High Dedication (based on attendance)', or 'Positive Classroom Conduct'.")
});
type AnalyzeTopStudentOutput = z.infer<typeof AnalyzeTopStudentOutputSchema>;


export async function analyzeTopStudent(input: AnalyzeTopStudentInput): Promise<AnalyzeTopStudentOutput> {
  const ai = configureGenkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'analyzeTopStudentPrompt',
    input: {schema: AnalyzeTopStudentInputSchema},
    output: {schema: AnalyzeTopStudentOutputSchema},
    prompt: `You are an academic advisor writing a profile for an award-winning student.
  
  Student Name: {{{studentName}}}
  School: {{{schoolName}}}
  Grade: {{{grade}}}
  
  **Academic Data:**
  - Average Grade: {{averageGrade}}/20
  - Attendance Rate: {{attendanceRate}}%
  - Recent Grades:
    {{#each grades}}
    - {{subject}}: {{grade}}
    {{/each}}
  
  **Behavioral Assessments (Scale 1-5):**
  {{#if behavioralAssessments}}
    {{#each behavioralAssessments}}
    - Respect: {{respect}}, Participation: {{participation}}, Social Skills: {{socialSkills}}, Conduct: {{conduct}}. Comment: "{{comment}}"
    {{/each}}
  {{else}}
    No behavioral assessments on record.
  {{/if}}

  Based on all this data, write a celebratory analysis of why {{{studentName}}} is a top student.

  - Highlight their impressive overall average grade and identify their top-performing subject(s).
  - Note their excellent attendance rate as a sign of dedication.
  - If available, incorporate their positive behavioral assessments (scores of 4 or 5) into the analysis, highlighting them as a well-rounded individual (e.g., "Not only excels academically but is also noted for respectful conduct and active participation in class.").
  - Conclude with a bulleted list of their key strengths, including both academic and behavioral aspects.
  - The tone should be positive and recognize the student's hard work, talent, and character.
  `,
  });

  const {output} = await prompt(input);
  return output!;
}
