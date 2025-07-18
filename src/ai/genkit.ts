/**
 * @fileoverview This file is the main entry point for Genkit.
 */
import {genkit} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';
import {AlwaysOnSampler, NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';

const provider = new NodeTracerProvider({
  sampler: new AlwaysOnSampler(),
});

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces',
    })
  )
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
