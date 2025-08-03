'use server';
/**
 * @fileOverview An AI flow for analyzing a student's academic performance.
 * 
 * - analyzeStudentPerformance - Generates personalized advice for a student.
 * - AnalyzeStudentPerformanceParams - Input type for the student analysis.
 * - StudentAnalysis - Output type for the generated analysis.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GradeSchema = z.object({
  subject: z.string(),
  grade: z.string(),
  type: z.string(),
  description: z.string(),
});

const AttendanceRecordSchema = z.object({
    status: z.string(),
    count: z.number(),
});

export const AnalyzeStudentPerformanceParamsSchema = z.object({
  studentName: z.string().describe("The name of the student being analyzed."),
  grades: z.array(GradeSchema).describe("An array of the student's recent grades."),
  attendance: z.array(AttendanceRecordSchema).describe("A summary of the student's attendance."),
});
export type AnalyzeStudentPerformanceParams = z.infer<typeof AnalyzeStudentPerformanceParamsSchema>;

export const StudentAnalysisSchema = z.object({
    strengths: z.array(z.string()).describe("A list of 2-3 academic strengths identified from the data."),
    areasForImprovement: z.array(z.string()).describe("A list of 2-3 specific areas where the student could improve."),
    recommendations: z.array(z.string()).describe("A list of 3-4 concrete, actionable recommendations for the student to improve their performance."),
});
export type StudentAnalysis = z.infer<typeof StudentAnalysisSchema>;

export async function analyzeStudentPerformance(params: AnalyzeStudentPerformanceParams): Promise<StudentAnalysis> {
  return studentAnalysisFlow(params);
}

const studentAnalysisPrompt = ai.definePrompt({
  name: 'studentAnalysisPrompt',
  input: { schema: AnalyzeStudentPerformanceParamsSchema },
  output: { schema: StudentAnalysisSchema },
  prompt: `
    You are an encouraging and insightful academic advisor named 'EduBot'. Your role is to analyze a student's performance and provide clear, actionable advice. Your tone should be positive and supportive, even when discussing areas for improvement.

    **Student Name:** {{studentName}}

    **Academic Data:**
    Here are the student's recent grades. A passing grade is 12/20.
    {{#each grades}}
    - Subject: {{subject}}, Grade: {{grade}} on "{{description}}" ({{type}})
    {{/each}}

    **Attendance Data:**
    Here is a summary of the student's attendance.
     {{#each attendance}}
    - {{status}}: {{count}}
    {{/each}}

    **Your Task:**
    Based on the data provided, perform the following analysis:

    1.  **Identify Strengths:** Pinpoint 2-3 subjects or skills where the student is excelling. Be specific (e.g., "Excellent performance in History essays," not just "Good at History").
    2.  **Identify Areas for Improvement:** Find 2-3 specific, concrete areas where the student is struggling or could improve. Frame this constructively (e.g., "Focus on improving test scores in Mathematics," not "Bad at Math"). If attendance is an issue (high absences or lates), mention it as a key area.
    3.  **Provide Actionable Recommendations:** Generate a list of 3-4 clear, simple, and actionable recommendations. These should directly relate to the areas for improvement. Examples: "Review algebra concepts for 30 minutes before each Math class," or "Try to create summary notes after each History lesson to prepare for exams."
  `,
});

const studentAnalysisFlow = ai.defineFlow(
  {
    name: 'studentAnalysisFlow',
    inputSchema: AnalyzeStudentPerformanceParamsSchema,
    outputSchema: StudentAnalysisSchema,
  },
  async (params) => {
    const { output } = await studentAnalysisPrompt(params);
    if (!output) {
      throw new Error('Failed to generate student analysis from the AI model.');
    }
    return output;
  }
);
