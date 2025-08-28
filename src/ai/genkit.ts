
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { Plugin } from '@genkit-ai/core';

const plugins: Plugin<any>[] = [];

if (process.env.GOOGLE_API_KEY) {
    plugins.push(googleAI({
        apiKey: process.env.GOOGLE_API_KEY
    }));
} else {
    console.warn("GOOGLE_API_KEY is not set. AI features will be disabled.");
}

export const ai = genkit({
  plugins: plugins,
});
