/**
 * @fileoverview This file is the main entry point for Genkit.
 */
import { genkit, configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

const googleAiPlugin = googleAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

configureGenkit({
  plugins: [googleAiPlugin],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const ai = genkit();
