/**
 * https://github.com/mistralai/client-js
 * https://github.com/mistralai/client-ts
 *
 * node -r dotenv/config mistral/chat-sdk.js
 */

import { Mistral } from '@mistralai/mistralai'

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
})

// const request = {
//   model: 'mistral-large-latest',
//   messages: [{ role: 'user', content: 'Who are you?' }],
// }

const request = {
  model: 'mistral-large-latest',
  temperature: 0.1,
  messages: [
    { role: 'system', content: 'You are the virtual assistant for IDETA.' },
    {
      role: 'user',
      content:
        'Hello, my name is Anh-Thi Dinh (first name is Thi, last name is Dinh). My email is "thi@ideta.io". I\'m from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.\n',
    },
  ],
  tools: [
    {
      type: 'function',
      function: {
        name: 'Nj9Yn8D7ovTLtoAZGqY',
        description: 'Get the full name and email of the user.',
        parameters: {
          type: 'object',
          properties: {
            lastName: {
              type: 'string',
              description: "Get the last name of the client if it's available.",
            },
            firstName: {
              type: 'string',
              description: "Get the first name of the client if it's available.",
            },
            email: {
              type: 'string',
              description: "Get the email of the client if it's available.",
            },
          },
          required: ['lastName', 'firstName', 'email'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'NjMi84x01DY8i7XXRk4',
        description: 'Get the phone number of the user.',
        parameters: {
          type: 'object',
          properties: {
            phoneNumber: {
              type: 'number',
              description: 'Get the phone number from the user input.',
            },
          },
          required: ['phoneNumber'],
        },
      },
    },
  ],
}

const result = await mistral.chat.complete(request)
console.log(JSON.stringify(result, null, 2))
