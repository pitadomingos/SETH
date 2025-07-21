'use server';

import { analyzeStudentFailure } from "@/ai/flows/analyze-student-failure";
import { generateParentAdvice } from "@/ai/flows/generate-parent-advice";

// This file is intentionally left with these functions to be used by the UI components.
// We are re-exporting them here to follow the pattern of having actions in the /actions directory.

export { analyzeStudentFailure, generateParentAdvice };
