
'use server';
import { gradeStudentTest, type GradeStudentTestInput } from '@/ai/flows/grade-test';

export async function gradeTestAction(input: GradeStudentTestInput) {
    try {
        const result = await gradeStudentTest(input);
        return result;
    } catch (error) {
        console.error("Error grading test:", error);
        return null;
    }
}
