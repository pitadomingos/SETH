
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

const SchoolPerformanceSchema = z.object({
    schoolName: z.string(),
    averageGrade: z.number(),
});

const AnalyzeStudentPerformanceParamsSchema = z.object({
  studentName: z.string().describe("The name of the student being analyzed."),
  grades: z.array(GradeSchema).describe("An array of the student's recent grades."),
  attendance: z.array(AttendanceRecordSchema).describe("A summary of the student's attendance."),
  schoolPerformance: z.array(SchoolPerformanceSchema).optional().describe("An optional array comparing the student's performance across different schools they have attended."),
});
export type AnalyzeStudentPerformanceParams = z.infer<typeof AnalyzeStudentPerformanceParamsSchema>;

const StudentAnalysisSchema = z.object({
    strengths: z.array(z.string()).describe("A list of 2-3 academic strengths identified from the data."),
    areasForImprovement: z.array(z.string()).describe("A list of 2-3 specific, concrete areas where the student could improve."),
    recommendations: z.array(z.string()).describe("A list of 3-4 concrete, actionable recommendations for the student to improve their performance."),
    crossSchoolAnalysis: z.string().optional().describe("If performance data across multiple schools is provided, this field will contain a brief analysis comparing performance between schools."),
});
export type StudentAnalysis = z.infer<typeof StudentAnalysisSchema>;

export async function analyzeStudentPerformance(params: AnalyzeStudentPerformanceParams): Promise<StudentAnalysis> {
  return studentAnalysisFlow(params);
}

const studentAnalysisPrompt = ai.definePrompt({
  name: 'studentAnalysisPrompt',
  model: 'googleai/gemini-1.5-flash',
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

    {{#if schoolPerformance}}
    **Cross-School Performance Analysis:**
    The student has attended multiple schools in our network. Here is their comparative performance:
    {{#each schoolPerformance}}
    - At {{schoolName}}, their average grade was {{averageGrade}}/20.
    {{/each}}
    Based on this, you must generate a brief, one-paragraph analysis in the 'crossSchoolAnalysis' field comparing the performance and suggesting which school environment appeared to be more effective for the student and why.
    {{/if}}

    **Your Task:**
    Based on all the data provided, perform the following analysis:

    1.  **Identify Strengths:** Pinpoint 2-3 subjects or skills where the student is excelling. Be specific (e.g., "Excellent performance in History essays," not just "Good at History").
    2.  **Identify Areas for Improvement:** Find 2-3 specific, concrete areas where the student is struggling or could improve. Frame this constructively (e.g., "Focus on improving test scores in Mathematics," not "Bad at Math"). If attendance is an issue (high absences or lates), mention it as a key area.
    3.  **Provide Actionable Recommendations:** Generate a list of 3-4 clear, simple, and actionable recommendations. These should directly relate to the areas for improvement. Examples: "Review algebra concepts for 30 minutes before each Math class," or "Try to create summary notes after each History lesson to prepare for exams."
    4.  **Cross-School Analysis (if applicable):** If school performance data was provided, fill the 'crossSchoolAnalysis' field as instructed above.
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
