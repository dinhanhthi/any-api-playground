/**
 * https://github.com/mistralai/client-js
 * https://github.com/mistralai/client-ts
 *
 * node -r dotenv/config mistral/fc-sdk-1st-steps.js
 */

import { Mistral } from '@mistralai/mistralai'

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
})

const request = {
  model: 'mistral-large-latest',
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

const result = await mistral.chat.complete(request)
console.log(JSON.stringify(result, null, 2))
