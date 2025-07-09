
'use server';
/**
 * @fileOverview An AI flow to analyze student test results and provide revision advice.
 *
 * - analyzeTestResults - A function that handles the test result analysis.
 * - AnalyzeTestResultsInput - The input type for the function.
 * - AnalyzeTestResultsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TestQuestionSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
});

const StudentSubmissionSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  score: z.number().describe("The student's score, out of 20."),
  answers: z.record(z.string()).describe("A map of student's answers, where the key is the question index and the value is the selected option."),
});

export const AnalyzeTestResultsInputSchema = z.object({
  testTopic: z.string().describe("The topic of the test."),
  questions: z.array(TestQuestionSchema).describe("The array of test questions, including correct answers."),
  submissions: z.array(StudentSubmissionSchema).describe("An array of all student submissions for this test."),
});
export type AnalyzeTestResultsInput = z.infer<typeof AnalyzeTestResultsInputSchema>;

const RevisionSuggestionSchema = z.object({
    topic: z.string().describe("A specific sub-topic or concept the student should revise."),
    reasoning: z.string().describe("A brief explanation of why this topic needs revision, referencing the questions they got wrong."),
});

const StrugglingStudentAnalysisSchema = z.object({
    studentId: z.string(),
    studentName: z.string(),
    score: z.number(),
    revisionSuggestions: z.array(RevisionSuggestionSchema).describe("A list of personalized revision suggestions for the student."),
});

export const AnalyzeTestResultsOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, high-level summary of the class's performance on the test, including average score and general observations."),
  strugglingStudents: z.array(StrugglingStudentAnalysisSchema).describe("A list of students who performed poorly (score below 12/20) and their personalized revision advice."),
});
export type AnalyzeTestResultsOutput = z.infer<typeof AnalyzeTestResultsOutputSchema>;

export async function analyzeTestResults(input: AnalyzeTestResultsInput): Promise<AnalyzeTestResultsOutput> {
  return analyzeTestResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTestResultsPrompt',
  input: {schema: AnalyzeTestResultsInputSchema},
  output: {schema: AnalyzeTestResultsOutputSchema},
  prompt: `You are an expert AI educational analyst. Your task is to analyze the results of a test on the topic of "{{testTopic}}" and provide actionable feedback for the teacher.

**Test & Submission Data:**

**Questions:**
{{#each questions}}
- Q{{@index}}: {{this.questionText}} (Correct: {{this.correctAnswer}})
{{/each}}

**Student Submissions:**
{{#each submissions}}
- {{this.studentName}}: Score {{this.score}}/20
  Answers:
  {{#each this.answers}}
  - Q{{@key}}: {{this}}
  {{/each}}
{{/each}}

**Your Tasks:**

1.  **Overall Summary:** Provide a concise summary of the class's performance. Mention the average score and any general patterns you observe (e.g., "Most students struggled with questions about concept X").

2.  **Identify Struggling Students:** Identify all students who scored below 12 out of 20. These are the students who need intervention.

3.  **Generate Personalized Revision Advice:** For each struggling student you identified:
    -   Review the specific questions they answered incorrectly.
    -   Based on the content of those wrong questions, infer the underlying concepts or sub-topics they need to revise.
    -   Provide a list of specific, actionable revision suggestions. For example, if they failed questions about photosynthesis, suggest they "Revise the light-dependent reactions of photosynthesis."
    -   For each suggestion, provide a brief reasoning, like "This is suggested because you missed questions about chlorophyll's role."

Return the entire analysis in the specified JSON format. If no students are struggling, return an empty list for 'strugglingStudents'.
`,
});

const analyzeTestResultsFlow = ai.defineFlow(
  {
    name: 'analyzeTestResultsFlow',
    inputSchema: AnalyzeTestResultsInputSchema,
    outputSchema: AnalyzeTestResultsOutputSchema,
  },
  async (input) => {
    if (input.submissions.length === 0) {
      return {
        overallSummary: "No submissions have been recorded for this test yet. Analysis cannot be performed.",
        strugglingStudents: [],
      };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
