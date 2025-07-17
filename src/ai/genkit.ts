
import 'dotenv/config';
import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is the default `ai` export.
// It is used for `genkit start` and `genkit eval`
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
