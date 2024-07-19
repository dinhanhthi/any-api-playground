/**
 * Copied from https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
 *
 *  How to use?
 *
 * node -r dotenv/config openai/streaming.js
 *
 */

import OpenAI, { AzureOpenAI } from 'openai'
// import got from 'got/dist/source/index.js'

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

  // const client = new OpenAI()
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
    // process.stdout.write(chunk.choices?.[0]?.delta?.content || '') // print in one line
    // if (chunk.choices?.[0]?.finish_reason) {
    //   console.log(chunk)
    //   callback()
    // }
    console.log(JSON.stringify(chunk, null, 2))
  }

  // 👇 In case use fetch API. Need more work to handle the format of return.

  // const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
  // if (!reader) return
  // // eslint-disable-next-line no-constant-condition
  // while (true) {
  //   // eslint-disable-next-line no-await-in-loop
  //   const { value, done } = await reader.read()
  //   if (done) break
  //   let dataDone = false
  //   const arr = value.split('\n')
  //   arr.forEach(data => {
  //     if (data.length === 0) return // ignore empty message
  //     if (data.startsWith(':')) return // ignore sse comment message
  //     if (data === 'data: [DONE]') {
  //       dataDone = true
  //       return
  //     }
  //     try {
  //       const json = JSON.parse(data.substring(6))
  //     // console.log(json?.choices?.[0]?.delta?.content)
  //     process.stdout.write(json?.choices?.[0]?.delta?.content || '')
  //     } catch (e) {
  //       // console.error('Error parsing JSON:', e)
  //     }
  //   })
  //   if (dataDone) break
  // }
}

main()
