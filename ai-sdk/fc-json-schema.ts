/**
 * Function calling example using plain JSON Schema (without Zod)
 * Ref: https://ai-sdk.dev/docs/reference/ai-sdk-core/json-schema
 *
 * How to run:
 * bun run ai-sdk/fc-json-schema.ts
 */

import { openai } from '@ai-sdk/openai'
import { generateText, jsonSchema } from 'ai'
import { inspect } from 'node:util'

// Define the schema using plain JSON Schema
const weatherToolSchema = jsonSchema<{ location: string }>({
  type: 'object',
  properties: {
    location: {
      type: 'string',
      description: 'The location to get the weather for',
    },
  },
  required: ['location'],
})

const result = await generateText({
  model: openai('gpt-4o'),
  // system: 'Your name is XXXThi',
  // prompt: 'What is the weather in San Francisco?',
  tools: {
    weather: {
      description: 'Get the weather in a location',
      inputSchema: weatherToolSchema,
      // Uncomment to execute the tool
      // execute: async ({ location }) => ({
      //   location,
      //   temperature: 72 + Math.floor(Math.random() * 21) - 10,
      // }),
    },
  },
  messages: [
    {
      role: 'user',
      content: 'What is the weather in San Francisco?'
    }
  ]
})

// Return only the result of tools/messages
console.log('Text result:', inspect(result.text, { depth: null, colors: true }))
console.log('Tool calls:', inspect(result.toolCalls, { depth: null, colors: true }))
