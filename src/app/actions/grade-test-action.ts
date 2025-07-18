
'use server';

import 'dotenv/config';
import { gradeStudentTest, type GradeStudentTestInput } from '@/ai/flows/grade-test';
import { useSchoolData } from '@/context/school-data-context';

export async function gradeTestAction(input: GradeStudentTestInput) {
    try {
        const result = await gradeStudentTest(input);
        return result;
    } catch (error) {
        console.error("Error grading test:", error);
        return null;
    }
}
