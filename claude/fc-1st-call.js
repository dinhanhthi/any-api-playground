/**
 * From: https://docs.anthropic.com/en/api/client-sdks#typescript
 *
 * How to use?
 * node -r dotenv/config claude/fc-1st-call.js
 */

import Anthropic from '@anthropic-ai/sdk'
import { inspect } from 'util'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

const promise = await anthropic.messages.create({
  model: 'claude-sonnet-4-0',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: 'What is the weather like in Paris today?',
    },
  ],
  tools: [
    {
      name: 'get_weather',
      description: 'Get current temperature for a given location',
      input_schema: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City and country e.g. Bogotá, Colombia',
          },
        },
        required: ['location'],
      },
    },
  ],
})

console.log(inspect(promise, { colors: true, depth: null }))
