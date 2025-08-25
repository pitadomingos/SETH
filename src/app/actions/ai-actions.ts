
'use server';

import { generateLessonPlan, GenerateLessonPlanParams } from "@/ai/flows/lesson-planner-flow";
import { analyzeStudentPerformance, AnalyzeStudentPerformanceParams } from "@/ai/flows/student-analysis-flow";
import { generateTest, GenerateTestParams } from '@/ai/flows/test-generator-flow';
import { analyzeSchoolPerformance, SchoolAnalysisParams } from '@/ai/flows/school-analysis-flow';


export async function generateLessonPlanAction(params: GenerateLessonPlanParams) {
    return await generateLessonPlan(params);
}

export async function analyzeStudentPerformanceAction(params: AnalyzeStudentPerformanceParams) {
    return await analyzeStudentPerformance(params);
}

export async function generateTestAction(params: GenerateTestParams) {
    return await generateTest(params);
}

export async function analyzeSchoolPerformanceAction(params: SchoolAnalysisParams) {
    return await analyzeSchoolPerformance(params);
}
