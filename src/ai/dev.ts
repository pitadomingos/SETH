/**
 * @fileoverview This file is the development entry point for Genkit.
 *
 * It is not used in the production build.
 *
 * To run the Genkit development server, run `npm run genkit:start`.
 */

import 'dotenv/config';
import {getFlows} from '@genkit-ai/flow';

export default {
  getFlows,
};
