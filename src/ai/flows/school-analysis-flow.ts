
'use server';
/**
 * @fileOverview An AI flow for generating various performance analysis reports for a school.
 * 
 * - analyzeSchoolPerformance - Generates a report based on the specified type.
 * - SchoolAnalysisParams - Input type for the report generation.
 * - SchoolAnalysis - Output type for the generated report.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StudentInfoSchema = z.object({
  name: z.string(),
  grade: z.string(),
  class: z.string(),
});

const TeacherInfoSchema = z.object({
  name: z.string(),
  subject: z.string(),
});

const GradeInfoSchema = z.object({
  studentId: z.string(),
  subject: z.string(),
  grade: z.string(),
});

const AttendanceInfoSchema = z.object({
  studentId: z.string(),
  status: z.string(),
});

export const SchoolAnalysisParamsSchema = z.object({
  type: z.enum(['School-Wide', 'Class Performance', 'Struggling Students', 'Teacher Performance']),
  schoolName: z.string(),
  students: z.array(StudentInfoSchema),
  teachers: z.array(TeacherInfoSchema),
  grades: z.array(GradeInfoSchema),
  attendance: z.array(AttendanceInfoSchema),
});
export type SchoolAnalysisParams = z.infer<typeof SchoolAnalysisParamsSchema>;

export const SchoolAnalysisSchema = z.object({
  title: z.string().describe("The title of the generated report."),
  summary: z.string().describe("A one-paragraph summary of the key findings in the report."),
  keyMetrics: z.array(z.object({
    metric: z.string().describe("The name of the key metric (e.g., 'Average Grade', 'Attendance Rate')."),
    value: z.string().describe("The value of the metric."),
  })).describe("A list of 3-4 key performance metrics relevant to the report type."),
  insights: z.array(z.string()).describe("A list of 3-5 bullet-point insights derived from the data analysis."),
  recommendations: z.array(z.string()).describe("A list of 3-5 actionable recommendations for school improvement based on the insights."),
});
export type SchoolAnalysis = z.infer<typeof SchoolAnalysisSchema>;

export async function analyzeSchoolPerformance(params: SchoolAnalysisParams): Promise<SchoolAnalysis> {
  return schoolAnalysisFlow(params);
}

const schoolAnalysisPrompt = ai.definePrompt({
  name: 'schoolAnalysisPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: SchoolAnalysisParamsSchema },
  output: { schema: SchoolAnalysisSchema },
  prompt: `
    You are an expert educational data analyst for {{schoolName}}. Your task is to generate a concise, insightful, and actionable performance report based on the provided data.

    **Report Type Requested:** {{type}}

    **Your Task:**
    Analyze the provided raw data on students, teachers, grades, and attendance to generate the requested report.

    - **If the type is "School-Wide"**: Provide a holistic overview of the school's performance. Focus on overall average grades, attendance rates, and any standout subjects or grade levels (either high or low performing).
    - **If the type is "Class Performance"**: Analyze and compare the performance of different classes. Identify the top-performing classes and those that might need additional support.
    - **If the type is "Struggling Students"**: Identify the top 5-10 students who are struggling the most based on low grades (a passing grade is 12/20) and poor attendance. Provide insights into *why* they might be struggling (e.g., specific subjects, frequent absences).
    - **If the type is "Teacher Performance"**: Analyze the performance of students grouped by teacher. Calculate the average student grade for each teacher in their respective subject. Identify high-performing teachers and those whose students may be struggling. Be fair and consider factors like subject difficulty.

    **For all reports, you must:**
    1.  **Generate a fitting Title and a Summary** of your findings.
    2.  **Calculate Key Metrics:** Extract and present 3-4 of the most important quantitative metrics relevant to the report type.
    3.  **Provide Insights:** Offer 3-5 bullet points of clear, data-backed insights. Don't just state the data; explain what it means.
    4.  **Give Actionable Recommendations:** Suggest 3-5 concrete, practical steps the school administration or teachers could take to address the findings in the report.

    **Raw Data (for context only, do not display in output):**
    - Students: {{json students}}
    - Teachers: {{json teachers}}
    - Grades: {{json grades}}
    - Attendance: {{json attendance}}
  `,
});

const schoolAnalysisFlow = ai.defineFlow(
  {
    name: 'schoolAnalysisFlow',
    inputSchema: SchoolAnalysisParamsSchema,
    outputSchema: SchoolAnalysisSchema,
  },
  async (params) => {
    const { output } = await schoolAnalysisPrompt(params);
    if (!output) {
      throw new Error('Failed to generate school analysis from the AI model.');
    }
    return output;
  }
);
