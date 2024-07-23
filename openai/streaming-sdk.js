/**
 *
 * How to use?
 *
 * node -r dotenv/config openai/streaming-sdk.js
 *
 */

import OpenAI from 'openai'

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

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const completion = await client.chat.completions.create(body)
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  for await (const chunk of completion) {
    // console.log(chunk)
    process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
  }

  callback()
}

main()
