
'use server';
/**
 * @fileOverview An AI flow for generating multiple-choice tests.
 * 
 * - generateTest - Generates a test based on subject, grade, topic, and number of questions.
 * - GenerateTestParams - Input type for the test generation.
 * - Test - Output type for the generated test.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateTestParamsSchema = z.object({
  subject: z.string().describe("The subject for the test (e.g., History, Physics)."),
  grade: z.string().describe("The grade level for the test (e.g., '10', '5')."),
  topic: z.string().describe("The specific topic the test should cover."),
  numQuestions: z.number().int().min(2).max(10).describe("The number of questions to generate."),
});
export type GenerateTestParams = z.infer<typeof GenerateTestParamsSchema>;

const QuestionSchema = z.object({
  question: z.string().describe("The text of the multiple-choice question."),
  options: z.array(z.string()).length(4).describe("An array of exactly 4 possible answers."),
  correctAnswer: z.string().describe("The correct answer from the options array."),
});

const TestSchema = z.object({
  subject: z.string(),
  grade: z.string(),
  topic: z.string(),
  questions: z.array(QuestionSchema).describe("An array of generated questions."),
});
export type Test = z.infer<typeof TestSchema>;

export async function generateTest(params: GenerateTestParams): Promise<Test> {
  return testGeneratorFlow(params);
}

const testGeneratorPrompt = ai.definePrompt({
  name: 'testGeneratorPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: GenerateTestParamsSchema },
  output: { schema: TestSchema },
  prompt: `
    You are an expert test creator for high school students.
    Your task is to create a multiple-choice test based on the following parameters.

    - **Subject:** {{subject}}
    - **Grade Level:** {{grade}}
    - **Topic:** {{topic}}
    - **Number of Questions:** {{numQuestions}}

    **Instructions:**
    1.  Generate exactly {{numQuestions}} multiple-choice questions.
    2.  Each question must have exactly 4 options.
    3.  One of the options must be the correct answer.
    4.  The questions should be relevant to the specified subject, grade, and topic.
    5.  The difficulty should be appropriate for a Grade {{grade}} student.
    6.  Ensure the 'correctAnswer' field in the output exactly matches one of the strings in the 'options' array for each question.
  `,
});

const testGeneratorFlow = ai.defineFlow(
  {
    name: 'testGeneratorFlow',
    inputSchema: GenerateTestParamsSchema,
    outputSchema: TestSchema,
  },
  async (params) => {
    const { output } = await testGeneratorPrompt(params);
    if (!output) {
      throw new Error('Failed to generate a test from the AI model.');
    }
    return output;
  }
);
