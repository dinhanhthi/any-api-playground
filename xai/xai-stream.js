/**
 * How to use?
 *
 * node -r dotenv/config xai/xai-stream.js
 */

import OpenAI from 'openai'

async function main() {
  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })

  // const model = await client.models.retrieve('grok-beta')
  // console.log(`👉👉👉 model: ${JSON.stringify(model, null, 2)}`)

  const body = {
    model: 'grok-beta',
    // max_completion_tokens: 200,
    messages: [
      {
        role: 'system',
        content: 'You are a useful assistant from Ideta.',
      },
      {
        role: 'user',
        content: 'hello, count from 1 to 100, separated by commas.',
      },
    ],
    stream: true
  }

  const completion = await client.chat.completions.create(body)
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  // /* ###Thi */ console.log(`👉👉👉 completion: ${JSON.stringify(completion, null, 2)}`);

  for await (const chunk of completion) {
    // console.log(chunk)
    process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
  }

  callback()
}

main()
