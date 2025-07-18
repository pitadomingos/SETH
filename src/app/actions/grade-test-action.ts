
'use server';

import 'dotenv/config';
import { schoolData } from '@/lib/mock-data';
import { gradeStudentTest } from '@/ai/flows/grade-student-test';

export async function gradeStudentTestAndSave(payload: {
  deployedTestId: string;
  studentId: string;
  studentAnswers: Record<string, string>;
}) {
    const { deployedTestId, studentId, studentAnswers } = payload;
    
    const studentSchoolId = Object.keys(schoolData).find(schoolId => 
        schoolData[schoolId].students.some(s => s.id === studentId)
    );
    
    if (!studentSchoolId) {
        console.error("Student's school not found.");
        return null;
    }

    const currentSchoolData = schoolData[studentSchoolId];

    const deployedTest = currentSchoolData.deployedTests.find(dt => dt.id === deployedTestId);
    const savedTest = currentSchoolData.savedTests.find(st => st.id === deployedTest?.testId);
    if (!deployedTest || !savedTest) {
        console.error("Deployed or saved test not found.");
        return null;
    }

    try {
        const result = await gradeStudentTest({
            subject: savedTest.subject,
            topic: savedTest.topic,
            questions: savedTest.questions,
            studentAnswers,
        });
        
        // Mutate the "database" to simulate saving the submission
        const submissionIndex = deployedTest.submissions.findIndex(s => s.studentId === studentId);
        const newSubmission = {
            studentId,
            answers: studentAnswers,
            score: result.score,
            submittedAt: new Date(),
        };

        if (submissionIndex > -1) {
            deployedTest.submissions[submissionIndex] = newSubmission;
        } else {
            deployedTest.submissions.push(newSubmission);
        }
        
        // Mutate the "database" to add the grade
        currentSchoolData.grades.push({
            studentId,
            subject: `${savedTest.subject} Test`,
            grade: String(result.score.toFixed(1)),
            date: new Date(),
        });

        return result;
    } catch (error) {
        console.error("Error during AI grading:", error);
        return null;
    }
}
