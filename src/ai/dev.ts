import { config } from 'dotenv';
config();

import '@/ai/flows/create-lesson-plan.ts';
import '@/ai/flows/generate-parent-advice.ts';
import '@/ai/flows/generate-test.ts';
import '@/ai/flows/analyze-class-performance.ts';
import '@/ai/flows/analyze-student-failure.ts';
import '@/ai/flows/analyze-school-system.ts';
import '@/ai/flows/identify-struggling-students.ts';
import '@/ai/flows/analyze-teacher-performance.ts';
import '@/ai/flows/analyze-school-performance.ts';
