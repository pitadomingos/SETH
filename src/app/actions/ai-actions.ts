
'use server';

import { generateLessonPlan, GenerateLessonPlanParams } from "@/ai/flows/lesson-planner-flow";
import { analyzeStudentPerformance, AnalyzeStudentPerformanceParams } from "@/ai/flows/student-analysis-flow";

export async function generateLessonPlanAction(params: GenerateLessonPlanParams) {
    return await generateLessonPlan(params);
}

export async function analyzeStudentPerformanceAction(params: AnalyzeStudentPerformanceParams) {
    return await analyzeStudentPerformance(params);
}
