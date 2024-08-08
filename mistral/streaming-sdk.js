/**
 * https://github.com/mistralai/client-ts/blob/main/docs/sdks/chat/README.md#stream
 *
 * How to use?
 *
 * node -r dotenv/config mistral/streaming-sdk.js
 *
 */

import { Mistral } from '@mistralai/mistralai'

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
})

async function run() {
  const result = await mistral.chat.stream({
    model: 'mistral-small-latest',
    messages: [
      {
        content: 'Count from 1 to 100, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
        role: 'user',
      },
    ],
  })

  for await (const event of result) {
    process.stdout.write(event?.data?.choices?.[0]?.delta?.content)
  }
}

run()
