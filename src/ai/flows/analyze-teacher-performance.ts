
'use server';
/**
 * @fileOverview An AI flow to analyze a teacher's performance based on their students' grades.
 *
 * - analyzeTeacherPerformance - A function that handles the teacher performance analysis.
 * - AnalyzeTeacherPerformanceInput - The input type for the function.
 * - AnalyzeTeacherPerformanceOutput - The return type for the function.
 */

import {configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const AnalyzeTeacherPerformanceOutputSchema = z.object({
  overallAssessment: z.string().describe("A high-level assessment of the teacher's performance, summarizing strengths and areas for improvement."),
  strengths: z.string().describe("A bulleted list of specific strengths observed from the data (e.g., 'High pass rate in Class 10-A')."),
  areasForImprovement: z.string().describe("A bulleted list of areas that may need attention (e.g., 'Lower than expected average in Class 9-B')."),
  comparisonAnalysis: z.string().optional().describe('A brief analysis comparing the current results to the previous ones, noting progress or regression.'),
  performanceScore: z.number().min(0).max(100).describe("A calculated performance score for the teacher from 0 to 100 based on student results."),
});
export type AnalyzeTeacherPerformanceOutput = z.infer<typeof AnalyzeTeacherPerformanceOutputSchema>;

const PreviousTeacherAnalysisSchema = z.object({
    generatedAt: z.string(),
    result: AnalyzeTeacherPerformanceOutputSchema,
});

const AnalyzeTeacherPerformanceInputSchema = z.object({
  teacherName: z.string().describe("The name of the teacher being analyzed."),
  subject: z.string().describe("The primary subject this teacher teaches."),
  classPerformances: z.array(z.object({
    className: z.string(),
    averageGrade: z.number().describe("The average grade for this class in the teacher's subject (0-20 scale)."),
    passingRate: z.number().describe("The percentage of students passing (grade >= 10) in this class."),
  })).describe("A list of performance metrics for each class the teacher teaches."),
  previousAnalysis: PreviousTeacherAnalysisSchema.optional().describe('A previously saved analysis for comparison.'),
});
export type AnalyzeTeacherPerformanceInput = z.infer<typeof AnalyzeTeacherPerformanceInputSchema>;


export async function analyzeTeacherPerformance(input: AnalyzeTeacherPerformanceInput): Promise<AnalyzeTeacherPerformanceOutput> {
  const ai = configureGenkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'analyzeTeacherPerformancePrompt',
    input: {schema: AnalyzeTeacherPerformanceInputSchema},
    output: {schema: AnalyzeTeacherPerformanceOutputSchema},
    prompt: `You are an expert academic performance reviewer for school administrators. Your task is to analyze the performance of a teacher based on the aggregate results of the classes they teach. The grading scale is 0-20, where >=10 is passing.

**Teacher Data:**
- Name: {{{teacherName}}}
- Subject: {{{subject}}}

**Class Performance Data:**
{{#each classPerformances}}
- Class: {{{className}}}
  - Average Grade: {{averageGrade}}/20
  - Passing Rate: {{passingRate}}%
{{/each}}

Analyze the data to provide a balanced and constructive performance review.
- Look for consistent high performance across classes as a key strength.
- Identify any classes that are outliers with significantly lower performance.
- Consider both the average grade and the passing rate. A high average with a low pass rate might indicate a wide gap in student understanding.

Provide an overall assessment, followed by bulleted lists of specific strengths and potential areas for improvement. Your tone should be professional and supportive, intended to help the administrator have a constructive conversation with the teacher.

Please also calculate a single 'performanceScore' from 0 to 100. A score of 100 represents a teacher whose students consistently achieve high average grades (e.g., >16/20) and high passing rates (>90%) across all classes. A score below 60 would indicate significant performance issues in one or more classes. Factor in both the average grade and passing rate in your calculation.

{{#if previousAnalysis}}
**Previous Analysis Comparison:**
A previous analysis for this teacher was run on {{previousAnalysis.generatedAt}}.
Please compare the current class performance data with the previous analysis. In the 'comparisonAnalysis' field, provide a brief, data-driven summary of the teacher's progress or regression, noting changes in average grades or passing rates across their classes.
{{/if}}
`,
  });

  const {output} = await prompt(input);
  return output!;
}
