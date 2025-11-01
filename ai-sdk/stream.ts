/**
 * Ref: https://ai-sdk.dev/docs/getting-started/nodejs
 *
 * How to run:
 * pnpm exec tsx ai-sdk/stream.ts
 * node -r dotenv/config ai-sdk/stream.ts
 */

// Disable AI SDK warnings
;(globalThis as any).AI_SDK_LOG_WARNINGS = false

import { createOpenAI } from '@ai-sdk/openai'
import { ModelMessage, streamText } from 'ai'
import { inspect } from 'util'
import 'dotenv/config'
import * as readline from 'node:readline/promises'

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const messages: ModelMessage[] = []

// async function main() {
//   while (true) {
//     const userInput = await terminal.question('You: ');

//     messages.push({ role: 'user', content: 'who are you?' });

//     const result = streamText({
//       model: openai('gpt-4o-mini'),
//       // temperature: 0.5,
//       messages,
//     });

//     let fullResponse = '';
//     process.stdout.write('\nAssistant: ');
//     for await (const delta of result.textStream) {
//       fullResponse += delta;
//       process.stdout.write(delta); // print in one line
//     }
//     process.stdout.write('\n\n');
//   }
// }

async function main() {
  messages.push({ role: 'user', content: 'who are you?' })

  const result = streamText({
    model: openai('gpt-4o-mini'),
    // temperature: 0.5,
    messages,
  })

  let fullResponse = ''
  for await (const delta of result.textStream) {
    fullResponse += delta
    console.log(inspect(delta, { depth: null }))
  }

  process.stdout.write('\n\n')
}

main().catch(console.error)
