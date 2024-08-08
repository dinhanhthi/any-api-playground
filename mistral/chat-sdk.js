/**
 * https://github.com/mistralai/client-js
 *
 * node -r dotenv/config mistral/chat-sdk.js
 */

import Mistral from '@mistralai/mistralai'

const client = new Mistral(process.env.MISTRAL_API_KEY)
const chatResponse = await client.chat({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: 'Who are you?' }],
})
console.log('Chat:', chatResponse?.choices?.[0]?.message?.content)

