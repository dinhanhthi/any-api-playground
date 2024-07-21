/**
 * https://github.com/mistralai/client-js
 *
 * How to use?
 *
 * node -r dotenv/config mistral/streaming-sdk.js
 *
 */

import MistralClient from '@mistralai/mistralai'

async function main() {
  const client = new MistralClient(process.env.MISTRAL_API_KEY)
  const chatStreamResponse = await client.chatStream({
    model: 'mistral-large-latest',
    messages: [
      {
        role: 'user',
        content:
          'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
      },
    ],
  })

  console.log('Chat Stream:')
  for await (const chunk of chatStreamResponse) {
    if (chunk.choices[0].delta.content !== undefined) {
      const streamText = chunk.choices[0].delta.content
      process.stdout.write(streamText)
    }
  }
}

main()
