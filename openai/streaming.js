/**
 * Copied from https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
 *
 *  How to use?
 *
 * node -r dotenv/config openai/streaming.js
 *
 */

import OpenAI from 'openai'

const openai = new OpenAI()

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' },
    ],
    stream: true,
  })

  let idx = 0
  for await (const chunk of completion) {
    // console.log(chunk.choices[0].delta.content);
    // process.stdout.write(chunk.choices[0]?.delta?.content || '') // print in one line

    if (idx === 0) {
      console.log(`👉👉👉 first chunk id: `, chunk?.id)
    }
    console.log('id: ', chunk.id)

    idx++
  }

  console.log('🥳 Done!')
}

main()