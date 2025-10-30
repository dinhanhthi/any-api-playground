/**
 * Ref: https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text
 *
 * How to run:
 * bun run ai-sdk/non-stream.ts
 */

import { openai } from '@ai-sdk/openai'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, jsonSchema, tool } from 'ai'
import { inspect } from 'node:util'

const model = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

function convertToAISdkTools(extractFunctions: any[]): any {
  const tools: any = {}

  extractFunctions.forEach(func => {
    const functionDef = func.function

    // Use tool() helper with jsonSchema() for proper JSON Schema format
    // inputSchema expects a JSON Schema object that defines the tool's input structure
    tools[functionDef.name] = tool({
      description: functionDef.description || `Tool: ${functionDef.name}`,
      inputSchema: jsonSchema(functionDef.parameters),
    })
  })

  return tools
}

/**
 * Convert OpenAI format messages to AI SDK ModelMessage format
 *
 * OpenAI format examples:
 * - User: { role: 'user', content: 'text' }
 * - Assistant with tool_calls: { role: 'assistant', tool_calls: [...] }
 * - Tool result: { role: 'tool', tool_call_id: 'id', content: 'result' }
 *
 * AI SDK format examples:
 * - User: { role: 'user', content: 'text' }
 * - Assistant with tool calls: { role: 'assistant', content: [{ type: 'tool-call', toolCallId, toolName, input }] }
 * - Tool result: { role: 'tool', content: [{ type: 'tool-result', toolCallId, toolName, output: { type: 'text', value } }] }
 */
function convertOpenAIMessagesToModelMessages(messages: any[]): any[] {
  return messages.map(msg => {
    // User message - no conversion needed
    if (msg.role === 'user') {
      return msg
    }

    // Assistant message with tool_calls (OpenAI format)
    if (msg.role === 'assistant' && msg.tool_calls) {
      return {
        role: 'assistant',
        content: msg.tool_calls.map((toolCall: any) => ({
          type: 'tool-call',
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          input: typeof toolCall.function.arguments === 'string'
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments,
        })),
      }
    }

    // Assistant message with text content
    if (msg.role === 'assistant') {
      return msg
    }

    // Tool result message (OpenAI format)
    if (msg.role === 'tool' && msg.tool_call_id) {
      // Extract tool name from the corresponding tool_call if available
      // For now, we'll need to pass it or infer it
      return {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: msg.tool_call_id,
            toolName: msg.name || 'unknown', // OpenAI includes 'name' field in tool messages
            output: {
              type: 'text',
              value: msg.content,
            },
          },
        ],
      }
    }

    // System message or other - no conversion needed
    return msg
  })
}

// Original messages in OpenAI format
const openAIMessages = [
  {
    content:
      "Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. I'm from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.",
    role: 'user',
  },
  {
    role: 'assistant',
    tool_calls: [
      {
        function: {
          arguments: '{"firstName":"Oliver","lastName":"Dinh","email":"harrypotter@ideta.io"}',
          name: 'Nj9Yn8D7ovTLtoAZGqY',
        },
        id: 'call_VxvqEf37m6y8gmQ2IcSW1Otv',
        type: 'function',
      },
    ],
  },
  {
    role: 'tool',
    tool_call_id: 'call_VxvqEf37m6y8gmQ2IcSW1Otv',
    name: 'Nj9Yn8D7ovTLtoAZGqY',
    content: 'Some data was displayed to the user',
  },
  {
    role: 'user',
    content: 'who are you?',
  },
]

const request: any = {
  model: model('gpt-4o'),
  system: 'You are an AI Assistant from Ideta. Your name is GPT Ideta.',
  messages: convertOpenAIMessagesToModelMessages(openAIMessages),
  // temperature: 0.1,
  tools: convertToAISdkTools(extractFunctions),
}

// Demo: Show the conversion
console.log('=== BEFORE CONVERSION (OpenAI format) ===')
console.log(JSON.stringify(openAIMessages[1], null, 2)) // Assistant with tool_calls
console.log(JSON.stringify(openAIMessages[2], null, 2)) // Tool result

console.log('\n=== AFTER CONVERSION (AI SDK ModelMessage format) ===')
const convertedMessages = convertOpenAIMessagesToModelMessages(openAIMessages)
console.log(JSON.stringify(convertedMessages[1], null, 2)) // Assistant with tool-call
console.log(JSON.stringify(convertedMessages[2], null, 2)) // Tool result

console.log('\n=== GENERATING TEXT ===')
const result = await generateText(request)

console.log('\n👉👉👉 result.text')
console.log(JSON.stringify(result.text, null, 2))

console.log('\n👉👉👉 result.toolCalls')
console.log(JSON.stringify(result.toolCalls, null, 2))
