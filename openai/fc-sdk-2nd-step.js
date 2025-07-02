/**
 * https://github.com/mistralai/client-js
 * https://github.com/mistralai/client-ts
 *
 * node -r dotenv/config openai/fc-sdk-2nd-step.js
 */

import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const request = {
  model: 'gpt-4.1',
  temperature: 0.1,
  messages: [
    {
      role: 'system',
      content: 'Your name is Mistral Dinh. Your email is xxx@yyy.com',
    },
    {
      role: 'user',
      content: 'What is the weather like in Paris today?',
    },
    {
      role: 'assistant',
      tool_calls: [
        {
          id: 'zZmPtNGHo',
          function: {
            name: 'OU5hn26uE_2MXaePKIQ',
            arguments: '{"location": "Paris, France"}',
          },
          type: 'function',
          index: 0,
        },
      ],
    },
    {
      role: 'tool',
      tool_call_id: 'zZmPtNGHo',
      content: '{"temperature":"14°C (57.2°F)"}',
    },
  ],
}

const completion = await client.chat.completions.create(request)
console.log(JSON.stringify(completion, null, 2))
