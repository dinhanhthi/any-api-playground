/**
 * Brain API streaming with tools support
 *
 * How to run:
 * pnpm exec tsx brain/brain-stream-tools.ts
 * node -r dotenv/config brain/brain-stream-tools.ts
 */

import axios from 'axios'
import FormData from 'form-data'
import { inspect } from 'util'
import 'dotenv/config'

interface ToolCall {
  index: number
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  tool_calls?: ToolCall[]
}

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

async function getToken(): Promise<string> {
  const form = new FormData()
  form.append('softlaw_client_id', process.env.BRAIN_SOFTLAW_CLIENT_ID)
  form.append('external_user_id', process.env.BRAIN_EXTERNAL_USER_ID)
  form.append('client_id', process.env.BRAIN_CLIENT_ID)
  form.append('client_secret', process.env.BRAIN_CLIENT_SECRET)
  form.append('pop_uri', process.env.BRAIN_POP_URI)

  const response = await axios.request({
    method: 'post',
    url: process.env.BRAIN_AUTH_ENDPOINT!,
    headers: {
      ...form.getHeaders(),
    },
    data: form,
  })

  return response?.data?.access_token
}

async function main() {
  const token = await getToken()

  const messages: Message[] = [
    {
      role: 'user',
      content:
        // "Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. I'm from Vietnam and my phone number is 4242424242.",
        "count from 1 to 50?"
    },
  ]

  console.log('=== BRAIN API STREAMING WITH TOOLS ===\n')

  const data = {
    model: 'mistral-small-24b',
    messages,
    tools: extractFunctions,
    stream: true,
  }

  const response = await axios.request({
    method: 'post',
    url: 'https://brain-api.softlaw.ai/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      spaceId: process.env.BRAIN_SPACE_ID!,
    },
    data: data,
    responseType: 'stream', // OBLIGATORY for streaming
  })

  const reader = response.data
  const decoder = new TextDecoder()
  let buffer = ''

  let fullText = ''
  const toolCalls: Map<number, ToolCall> = new Map()
  let finishReason: string | null = null

  console.log('📝 Text Stream:\n')

  reader.on('data', (chunk: Buffer) => {
    buffer += decoder.decode(chunk, { stream: true })
    let lines = buffer.split('\n')
    buffer = lines.pop() || '' // Keep the last part in buffer if it's incomplete

    for (let line of lines) {
      // Debug: log all lines
      if (process.env.DEBUG && line.trim()) {
        console.log('[DEBUG] Raw line:', line)
      }

      if (line.startsWith('data: ')) {
        let jsonChunk = line.substring(6) // Remove the "data: " prefix

        if (jsonChunk === '[DONE]') {
          console.log('\n\n🎉 Stream completed!')
          return
        }

        try {
          const parsedChunk = JSON.parse(jsonChunk)
          const delta = parsedChunk.choices?.[0]?.delta
          const choice = parsedChunk.choices?.[0]

          // Debug: log the entire chunk
          if (process.env.DEBUG) {
            console.log('\n[DEBUG] Chunk:', inspect(parsedChunk, { depth: null, colors: true }))
          }

          // Capture finish reason
          if (choice?.finish_reason) {
            finishReason = choice.finish_reason
          }

          // Handle text content
          if (delta?.content) {
            const message = delta.content
            process.stdout.write(message)
            fullText += message
          }

          // Handle tool calls
          if (delta?.tool_calls) {
            for (const toolCallDelta of delta.tool_calls) {
              const index = toolCallDelta.index

              if (!toolCalls.has(index)) {
                toolCalls.set(index, {
                  index,
                  id: toolCallDelta.id || '',
                  type: 'function',
                  function: {
                    name: toolCallDelta.function?.name || '',
                    arguments: toolCallDelta.function?.arguments || '',
                  },
                })
              } else {
                const existing = toolCalls.get(index)!
                if (toolCallDelta.id) {
                  existing.id = toolCallDelta.id
                }
                if (toolCallDelta.function?.name) {
                  existing.function.name = toolCallDelta.function.name
                }
                if (toolCallDelta.function?.arguments) {
                  existing.function.arguments += toolCallDelta.function.arguments
                }
              }
            }
          }
        } catch (error) {
          console.error('Failed to parse JSON chunk:', error)
          console.error('Problematic chunk:', jsonChunk)
        }
      }
    }
  })

  return new Promise<void>((resolve, reject) => {
    // reader.on('end', () => {
    //   console.log('\n\n📊 Final Results:\n')

    //   console.log('🔧 Finish Reason:', finishReason || 'unknown')

    //   console.log('\n🔧 Full Text:')
    //   console.log(fullText || '(no text content)')

    //   console.log('\n🔧 Tool Calls:')
    //   if (toolCalls.size > 0) {
    //     const toolCallsArray = Array.from(toolCalls.values()).map(tc => {
    //       let parsedArguments: any
    //       try {
    //         // Only parse if arguments is not empty
    //         parsedArguments = tc.function.arguments ? JSON.parse(tc.function.arguments) : {}
    //       } catch (error) {
    //         console.error(`Failed to parse arguments for ${tc.function.name}:`, tc.function.arguments)
    //         parsedArguments = tc.function.arguments // Keep as string if parsing fails
    //       }
    //       return {
    //         ...tc,
    //         function: {
    //           ...tc.function,
    //           arguments: parsedArguments,
    //         },
    //       }
    //     })
    //     console.log(inspect(toolCallsArray, { depth: null, colors: true }))
    //   } else {
    //     console.log('(no tool calls)')
    //   }

    //   resolve()
    // })

    reader.on('error', (error: Error) => {
      console.error('Stream error:', error)
      reject(error)
    })
  })
}

main().catch(console.error)
