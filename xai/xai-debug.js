/**
 * How to use?
 *
 * node -r dotenv/config xai/xai-debug.js
 */

import OpenAI from 'openai'
import { inspect } from 'util'

async function main() {
  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })

  const body = {
    model: 'grok-3-fast',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant from Ideta name XAIdeta. Only use tools when the current user message explicitly requires information extraction or action. Do not proactively extract information from previous messages.',
      },
      {
        content:
          'Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. My phone number is 4242424242. I want to talk to an agent about an error on your platform.',
        role: 'user',
      },
      {
        role: 'assistant',
        tool_calls: [
          {
            function: {
              arguments: '{"lastName":"Dinh","firstName":"Oliver","email":"harrypotter@ideta.io"}',
              name: 'Nj9Yn8D7ovTLtoAZGqY',
            },
            id: 'call_47407785',
            type: 'function',
          },
        ],
      },
      {
        role: 'tool',
        tool_call_id: 'call_47407785',
        content: 'Some data was displayed to the user',
      },
      { role: 'user', content: "I'm from France" },
    ],
    stream: true,
    // tool_choice: "none"
  }

  const completion = await client.chat.completions.create(body)
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  // /* ###Thi */ console.log(`👉👉👉 completion: ${JSON.stringify(completion, null, 2)}`);

  for await (const chunk of completion) {
    // console.log(chunk)
    console.log(inspect(chunk, { depth: null, colors: true })) // print in one line
    // process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
  }

  callback()
}

main()
