/**
 * @fileoverview This file is the main entry point for Genkit.
 */

import {genkit, type Plugin} from '@genkit-ai/core';
import {googleAI, type GoogleAIVertexPredictOptions} from '@genkit-ai/googleai';
import {dotprompt, type Prompt} from '@genkit-ai/dotprompt';
import { AlwaysOnSampler, OpenTelemetryTraceExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider }_from_ '@opentelemetry/sdk-trace-node';

import 'dotenv/config';


const provider = new NodeTracerProvider({
  sampler: new AlwaysOnSampler(),
});

provider.addSpanProcessor(
  new SimpleSpanProcessor(new OpenTelemetryTraceExporter())
);
provider.register();


const googleAiPlugin = googleAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const ai = genkit({
  plugins: [googleAiPlugin, dotprompt()],
  enableTracing: true,
  traceStore: 'dev-local',
});
