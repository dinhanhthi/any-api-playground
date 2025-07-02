/**
 * https://github.com/mistralai/client-js
 * https://github.com/mistralai/client-ts
 *
 * node -r dotenv/config openai/fc-sdk-1st-steps.js
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
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get current temperature for a given location.',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City and country e.g. Bogotá, Colombia',
            },
          },
          required: ['location'],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  ],
}

const completion = await client.chat.completions.create(request)
console.log(JSON.stringify(completion, null, 2))
