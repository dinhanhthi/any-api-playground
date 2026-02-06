/**
 * Brain API streaming with tools support
 *
 * How to run:
 * pnpm exec tsx brain/brain-stream-tools.ts
 * node -r dotenv/config brain/brain-stream-tools.ts
 */

import axios from 'axios'
import FormData from 'form-data'
import 'dotenv/config'
import { inspect } from 'util'

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
        "Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. I'm from Vietnam and my phone number is 4242424242.",
        // "who are you?"
    },
  ]

  console.log('=== BRAIN API STREAMING WITH TOOLS ===\n')

  // Callback function to be called when stream completes
  const onStreamComplete = (data: { fullText: string; toolCalls: ToolCall[]; finishReason: string | null }) => {
    console.log('\n\n📊 Stream Complete Callback!')
    console.log('Finish Reason:', data.finishReason || 'unknown')
    console.log('Full Text:', data.fullText || '(no text)')
    console.log('Tool Calls:', data.toolCalls.length)

    if (data.toolCalls.length > 0) {
      console.log('\nTool Call Details:')
      data.toolCalls.forEach((tc, idx) => {
        console.log(`\n  ${idx + 1}. ${tc.function.name}`)
        console.log(`     ID: ${tc.id}`)
        console.log(`     Arguments: ${tc.function.arguments || '(empty)'}`)
      })
    }
  }

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
    // /* ###Thi */ console.log(`👉👉👉 lines: ${inspect(lines, { depth: null, colors: true })}`);
    buffer = lines.pop() || '' // Keep the last part in buffer if it's incomplete

    for (let line of lines) {
      // /* ###Thi */ console.log(`👉👉👉 line: ${inspect(line, { depth: null, colors: true })}`);
      if (line.startsWith('data: ')) {
        let jsonChunk = line.substring(6) // Remove the "data: " prefix

        if (jsonChunk === '[DONE]') {
          console.log('\n\n🎉 Stream completed with [DONE] marker!')

          // Call the completion callback
          onStreamComplete({
            fullText,
            toolCalls: Array.from(toolCalls.values()),
            finishReason,
          })

          reader.destroy() // Close the stream
          return
        }

        try {
          const parsedChunk = JSON.parse(jsonChunk)
          const delta = parsedChunk.choices?.[0]?.delta
          const chunkFinishReason = parsedChunk.choices?.[0]?.finish_reason

          // Capture finish_reason
          if (chunkFinishReason) {
            finishReason = chunkFinishReason
            console.log(`\n[Stream finished: ${chunkFinishReason}]`)
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
    reader.on('end', () => {
      console.log('\n[Stream ended by server]')

      // Call the completion callback with accumulated data
      onStreamComplete({
        fullText,
        toolCalls: Array.from(toolCalls.values()),
        finishReason,
      })

      resolve()
    })

    reader.on('error', (error: Error) => {
      console.error('Stream error:', error)
      reject(error)
    })
  })
}

main().catch(console.error)
