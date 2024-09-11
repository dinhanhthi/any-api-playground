/**
 *
 * How to use?
 *
 * node -r dotenv/config openai/streaming-sdk-serialize.js
 *
 */

import OpenAI from 'openai'
import { Client as MemClient } from 'memjs'

async function main() {
  const memcachedClient = MemClient.create(process.env.MEMCACHIER_SERVERS, {
    username: process.env.MEMCACHIER_USERNAME,
    password: process.env.MEMCACHIER_PASSWORD,
    failover: true,  // default: false
    timeout: 1,      // default: 0.5 (seconds)
    keepAlive: true  // default: false
  })


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

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const completion = await client.chat.completions.create(body)

  const completionString = JSON.stringify(completion)
  await memcachedClient.set('completion', completionString)

  const storedCompletionString = await memcachedClient.get('completion')
  const storedCompletion = JSON.parse(storedCompletionString.value.toString())

  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  for await (const chunk of storedCompletion) {
    // console.log(chunk)
    process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
  }

  callback()
}

main()
