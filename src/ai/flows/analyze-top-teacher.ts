
'use server';
/**
 * @fileOverview An AI flow to analyze why a teacher is a top performer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTopTeacherInputSchema = z.object({
  teacherName: z.string().describe("The name of the teacher."),
  schoolName: z.string().describe("The name of the teacher's school."),
  subject: z.string().describe("The teacher's primary subject."),
  averageStudentGrade: z.number().describe("The average grade of this teacher's students (0-20 scale)."),
  classPerformances: z.array(z.object({
    className: z.string(),
    averageGrade: z.number(),
    passingRate: z.number(),
  })).describe("Performance data for each class the teacher teaches."),
});
type AnalyzeTopTeacherInput = z.infer<typeof AnalyzeTopTeacherInputSchema>;

const AnalyzeTopTeacherOutputSchema = z.object({
  analysis: z.string().describe("A detailed analysis celebrating the teacher's success. It should highlight their ability to achieve high average student grades and maintain excellent pass rates across different classes. Mention their subject and school. The tone should be professional and laudatory."),
  keyMetrics: z.array(z.string()).describe("A bulleted list of 2-3 key metrics that demonstrate their excellence, e.g., 'Maintained an average student grade of X across Y classes.'"),
});
type AnalyzeTopTeacherOutput = z.infer<typeof AnalyzeTopTeacherOutputSchema>;


export async function analyzeTopTeacher(input: AnalyzeTopTeacherInput): Promise<AnalyzeTopTeacherOutput> {
  return analyzeTopTeacherFlow(input);
}


const analyzeTopTeacherFlow = ai.defineFlow(
  {
    name: 'analyzeTopTeacherFlow',
    inputSchema: AnalyzeTopTeacherInputSchema,
    outputSchema: AnalyzeTopTeacherOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'analyzeTopTeacherPrompt',
      input: {schema: AnalyzeTopTeacherInputSchema},
      output: {schema: AnalyzeTopTeacherOutputSchema},
      prompt: `You are an educational consultant writing a commendation for a top-performing teacher.
      
      Teacher: {{{teacherName}}}
      School: {{{schoolName}}}
      Subject: {{{subject}}}
      
      Performance Data:
      - Overall Average Student Grade: {{averageStudentGrade}}/20
      - Performance per class:
        {{#each classPerformances}}
        - Class {{className}}: Avg. Grade {{averageGrade}}, Pass Rate {{passingRate}}%
        {{/each}}
      
      Based on this data, write an analysis explaining why {{{teacherName}}} is being recognized as a Teacher of the Year.
      
      - Start by congratulating the teacher on their outstanding achievement.
      - Emphasize their ability to achieve a high average grade across all their students.
      - Point out their effectiveness in ensuring high pass rates, showing their ability to teach students of all levels.
      - Conclude with a bulleted list of key, data-driven metrics that showcase their success.
      - The tone should be professional and celebratory.
      `,
    });

    const {output} = await prompt(input);
    return output!;
  }
);
