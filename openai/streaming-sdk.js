/**
 *
 * How to use?
 *
 * node -r dotenv/config openai/streaming-sdk.js
 *
 */

import OpenAI from 'openai'

async function main() {
  // const body = {
  //   model: 'gpt-4o',
  //   messages: [
  //     { role: 'system', content: 'You are a helpful assistant.' },
  //     {
  //       role: 'user',
  //       content:
  //         'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
  //     },
  //   ],
  //   stream: true,
  // }

  const body = {
    model: 'o1-mini',
    max_completion_tokens: 200,
    messages: [
      {
        role: 'user',
        content: 'You are a useful assistant from Ideta.',
      },
      {
        role: 'user',
        content: 'hello',
      },
    ],
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const completion = await client.chat.completions.create(body)
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  /* ###Thi */ console.log(`👉👉👉 completion: ${JSON.stringify(completion, null, 2)}`);

  // for await (const chunk of completion) {
  //   // console.log(chunk)
  //   process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
  // }

  callback()
}

main()
