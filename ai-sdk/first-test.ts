/**
 * Ref: https://ai-sdk.dev/docs/getting-started/nodejs
 *
 * How to run:
 * bun run ai-sdk/first-test.ts
 */

// Disable AI SDK warnings
(globalThis as any).AI_SDK_LOG_WARNINGS = false;

import { openai } from '@ai-sdk/openai';
import { ModelMessage, streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: openai('gpt-5'),
      temperature: 0.5,
      messages,
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      console.log(delta);
      // process.stdout.write(delta);
    }
    // process.stdout.write('\n\n');

    // messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);