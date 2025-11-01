/**
 * Ref: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text
 *
 * How to run:
 * pnpm exec tsx ai-sdk/gemini-no-stream.ts
 */

import 'dotenv/config'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { convertToAISdkTools } from './utils'

const service = 'google'

const model =
  service === 'google'
    ? createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
    : createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

const extractFunctions = [
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
          email: { type: 'string', description: "Get the email of the client if it's available." },
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
          phoneNumber: { type: 'number', description: 'Get the phone number from the user input.' },
        },
        required: ['phoneNumber'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'NjMvtCGJN4HoXREUteI',
      description: 'Get the country where the user come from',
      parameters: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'Get the country where the user come from' },
        },
        required: ['country'],
      },
    },
  },
]

const messages = [
  {
    role: 'user',
    content:
      "Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. I'm from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.",
  },
  {
    content: [
      {
        input: {
          email: 'harrypotter@ideta.io',
          firstName: 'Oliver',
          lastName: 'Dinh',
        },
        toolCallId: 'Nj9Yn8D7ovTLtoAZGqY-1',
        toolName: 'Nj9Yn8D7ovTLtoAZGqY',
        type: 'tool-call',
      },
    ],
    role: 'assistant',
  },
  {
    content: [
      {
        output: {
          type: 'text',
          value: 'Some data was displayed to the user',
        },
        toolCallId: 'Nj9Yn8D7ovTLtoAZGqY-1',
        toolName: 'Nj9Yn8D7ovTLtoAZGqY',
        type: 'tool-result',
      },
    ],
    role: 'tool',
  },
  {
    role: 'user',
    content: 'who are you?',
  },
  {
    content: 'I am a virtual assistant for IDETA.',
    role: 'assistant',
  },
  {
    role: 'user',
    content: 'What did I ask you so far?',
  }
]

const request: any = {
  model: model('gemini-2.5-flash'),
  system: 'You are an AI Assistant from Ideta. Your name is GPT Ideta.',
  messages,
  temperature: 0.1,
  tools: convertToAISdkTools(extractFunctions),
}

const result = await generateText(request)
// console.log(JSON.stringify(result, null, 2))
console.log(`result.text: ${result.text}`)
