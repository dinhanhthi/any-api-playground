/**
 * From: https://docs.anthropic.com/en/api/client-sdks#typescript
 *
 * How to use?
 * node -r dotenv/config claude/fc-2nd-call.js
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
    // After 1st call
    {
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: "I'll check the current weather in Paris for you.",
        },
        {
          type: 'tool_use',
          id: 'toolu_01QZSFigrobP4RCpGKdRHAQS',
          name: 'get_weather',
          input: {
            location: 'Paris, France',
          },
        },
      ],
    },
    // 2nd call
    {
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: 'toolu_01QZSFigrobP4RCpGKdRHAQS',
          content: '14°C (57.2°F)',
        },
      ],
    },
  ],
})

console.log(inspect(promise, { colors: true, depth: null }))
