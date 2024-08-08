/**
 * https://github.com/mistralai/client-js
 *
 * node -r dotenv/config mistral/chat-sdk.js
 */

import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const result = await mistral.chat.complete({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: 'Who are you?' }],
})
console.log(result.choices[0].message.content)


