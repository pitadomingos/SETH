/**
 * @fileoverview This file is the main entry point for Genkit.
 */
import { configureGenkit, genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export { genkit as ai };
