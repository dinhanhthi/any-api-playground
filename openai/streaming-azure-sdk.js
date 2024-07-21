/**
 *
 *  How to use?
 *
 * node -r dotenv/config openai/streaming-azure-sdk.js
 *
 */

import OpenAI, { AzureOpenAI } from 'openai'

async function main() {
  const body = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content:
          'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
      },
    ],
    stream: true,
  }

  const client = new AzureOpenAI({
    endpoint: process.env.AZURE_ENDPOINT,
    apiKey: process.env.AZURE_API_KEY,
    apiVersion: '2024-05-01-preview',
    deployment: 'gpt-4o',
  })

  const completion = await client.chat.completions.create(body)
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  for await (const chunk of completion) {
    process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
    if (chunk.choices?.[0]?.finish_reason) {
      // console.log(chunk)
      callback()
    }
  }
}

main()
