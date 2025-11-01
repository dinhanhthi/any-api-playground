/**
 * Ref: https://ai-sdk.dev/docs/getting-started/nodejs
 *
 * How to run:
 * pnpm exec tsx ai-sdk/fc.ts
 */

import 'dotenv/config'
import { z } from 'zod'
import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { inspect } from 'node:util'

const result = await generateText({
  model: openai('gpt-5'),
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      // execute: async ({ location }) => ({
      //   location,
      //   temperature: 72 + Math.floor(Math.random() * 21) - 10,
      // }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
})

// Return only the result of tools/messages
console.log('Text result:', inspect(result.text, { depth: null, colors: true }))
console.log('Tool calls:', inspect(result.toolCalls, { depth: null, colors: true }))
