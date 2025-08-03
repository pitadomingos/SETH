'use server';

import { generateLessonPlan, GenerateLessonPlanParams } from "@/ai/flows/lesson-planner-flow";

export async function generateLessonPlanAction(params: GenerateLessonPlanParams) {
    return await generateLessonPlan(params);
}