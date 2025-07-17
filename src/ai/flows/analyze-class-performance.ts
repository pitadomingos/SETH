
'use server';
/**
 * @fileOverview An AI flow to analyze class performance and recommend interventions.
 *
 * - analyzeClassPerformance - A function that handles the class performance analysis.
 * - AnalyzeClassPerformanceInput - The input type for the analyzeClassPerformance function.
 * - AnalyzeClassPerformanceOutput - The return type for the analyzeClassPerformance function.
 */

import {configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const AnalyzeClassPerformanceOutputSchema = z.object({
  analysis: z.string().describe('A concise, data-driven analysis of the class\'s performance, including average performance and any notable distribution patterns.'),
  recommendation: z.string().describe('A clear recommendation. If performance is poor, suggest an ad hoc test and provide a strong justification. If performance is good, suggest enrichment activities. State if a notification has been sent to the Head of School.'),
  interventionNeeded: z.boolean().describe('A boolean flag that is true if the analysis suggests an ad-hoc test or other intervention is needed, otherwise false.'),
  comparisonAnalysis: z.string().optional().describe('A brief analysis comparing the current results to the previous ones, noting progress or regression.'),
});
export type AnalyzeClassPerformanceOutput = z.infer<typeof AnalyzeClassPerformanceOutputSchema>;

const PreviousClassAnalysisSchema = z.object({
    generatedAt: z.string().describe("The ISO 8601 date string of when the previous analysis was generated."),
    result: AnalyzeClassPerformanceOutputSchema,
});

const AnalyzeClassPerformanceInputSchema = z.object({
  className: z.string().describe('The name of the class being analyzed.'),
  subject: z.string().describe('The subject being analyzed for the class.'),
  grades: z.array(z.string()).describe('An array of letter grades for the students in the class for the specified subject (e.g., ["A", "B+", "C-"]).'),
  previousAnalysis: PreviousClassAnalysisSchema.optional().describe('A previously saved analysis for comparison.'),
});
export type AnalyzeClassPerformanceInput = z.infer<typeof AnalyzeClassPerformanceInputSchema>;


export async function analyzeClassPerformance(input: AnalyzeClassPerformanceInput): Promise<AnalyzeClassPerformanceOutput> {
  const ai = configureGenkit({
    plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'analyzeClassPerformancePrompt',
    input: {schema: AnalyzeClassPerformanceInputSchema},
    output: {schema: AnalyzeClassPerformanceOutputSchema},
    prompt: `You are an expert AI educational analyst for a school management system called EduManage.
  Your task is to analyze the academic performance of a class based on a set of recent grades.
  The grading system uses both letter grades (A-F) and a numeric scale from 0 to 20, where 12 is a passing grade.

  Class Name: {{{className}}}
  Subject: {{{subject}}}
  
  Here are the grades:
  {{#each grades}}
  - {{this}}
  {{/each}}
  
  Analyze this data. Look for trends like a low class average, a high number of failing grades (below 'C' or below 12/20), or a very wide distribution of grades.
  
  Based on your analysis, provide a concise summary and a clear recommendation.
  
  - If the class performance is poor (e.g., average is below a 'B-', or there are many 'D', 'F', or sub-12 grades), you MUST recommend an ad-hoc diagnostic test to identify learning gaps. Your recommendation should state that a notification has also been sent to the Head of School for their awareness. Set the 'interventionNeeded' flag to true.
  - If the class performance is satisfactory or excellent, suggest a potential enrichment activity or project to challenge the students further. Set the 'interventionNeeded' flag to false.
  
  Your tone should be professional, data-driven, and supportive.

  {{#if previousAnalysis}}
  **Previous Analysis Comparison:**
  A previous analysis for this class was run on {{previousAnalysis.generatedAt}}. The results were:
  - Previous Analysis: "{{previousAnalysis.result.analysis}}"
  - Previous Recommendation: "{{previousAnalysis.result.recommendation}}"

  Please compare the current data with the previous analysis. In the 'comparisonAnalysis' field, provide a brief, data-driven summary of the progress or regression. For example: "Performance has improved significantly since the last analysis..." or "There has been a decline in performance..."
  {{/if}}
  `,
  });

  // If there are no grades, return a default "not enough data" response.
  if (input.grades.length === 0) {
    return {
      analysis: `There is not enough grade data for ${input.subject} in ${input.className} to perform an analysis.`,
      recommendation: "Please ensure grades are recorded for this class and subject to enable AI insights.",
      interventionNeeded: false,
    };
  }
  const {output} = await prompt(input);
  return output!;
}
