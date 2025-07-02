/**
 * https://github.com/mistralai/client-js
 * https://github.com/mistralai/client-ts
 *
 * node -r dotenv/config mistral/fc-sdk-2nd-step.js
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
    {
      role: 'assistant',
      toolCalls: [
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
      toolCallId: 'zZmPtNGHo',
      content: '{"temperature":"14°C (57.2°F)"}',
    },
  ],
}

const result = await mistral.chat.complete(request)
console.log(JSON.stringify(result, null, 2))
