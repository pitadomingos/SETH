import { config } from 'dotenv';
config();

import '@/ai/flows/create-lesson-plan.ts';
import '@/ai/flows/generate-parent-advice.ts';
import '@/ai/flows/generate-test.ts';
import '@/ai/flows/analyze-class-performance.ts';
