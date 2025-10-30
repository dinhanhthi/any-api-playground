/**
 * Ref: https://ai-sdk.dev/docs/getting-started/nodejs
 *
 * How to run:
 * bun run ai-sdk/stream-tools.ts
 * node -r dotenv/config ai-sdk/stream-tools.ts
 */

// Disable AI SDK warnings
;(globalThis as any).AI_SDK_LOG_WARNINGS = false

import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { inspect } from 'util'
import 'dotenv/config'
import { convertToAISdkTools } from './utils'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define extract functions in OpenAI format
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

async function main() {
  const messages = [
    {
      role: 'user' as const,
      content:
        "Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. I'm from Vietnam and my phone number is 4242424242.",
    },
  ]

  console.log('=== STREAMING WITH TOOLS ===\n')

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are an AI Assistant from Ideta. Your name is GPT Ideta.',
    messages,
    tools: convertToAISdkTools(extractFunctions),
  })

  // Stream text deltas
  console.log('📝 Text Stream:')
  let fullText = ''
  for await (const delta of result.textStream) {
    fullText += delta
    // process.stdout.write(delta)
    console.log(inspect(delta, { depth: null }))
  }
  process.stdout.write('\n\n')

  // IMPORTANT: After consuming textStream, we need to await the individual promises
  console.log('🔧 Tool Calls:')
  const toolCalls = await result.toolCalls
  console.log(inspect(toolCalls, { depth: null, colors: true }))

  console.log('\n📊 Tool Results:')
  const toolResults = await result.toolResults
  console.log(inspect(toolResults, { depth: null, colors: true }))

  console.log('\n📄 Full Text:')
  const text = await result.text
  console.log(text)

  console.log('\n📈 Usage:')
  const usage = await result.usage
  console.log(inspect(usage, { depth: null, colors: true }))
}

main().catch(console.error)

