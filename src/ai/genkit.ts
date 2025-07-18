/**
 * @fileoverview This file is the main entry point for Genkit.
 */
import 'dotenv/config';
import {genkit, type Plugin} from '@genkit-ai/core';
import {googleAI, type GoogleAIVertexPredictOptions} from '@genkit-ai/googleai';
import { AlwaysOnSampler, OpenTelemetryTraceExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';


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
  plugins: [googleAiPlugin],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
