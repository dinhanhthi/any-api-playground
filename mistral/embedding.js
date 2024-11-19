/**
 * https://github.com/mistralai/client-ts/blob/main/docs/sdks/embeddings/README.md#create
 *
 * node -r dotenv/config mistral/embedding.js
 */

import { Mistral } from '@mistralai/mistralai'

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
})

const result = await mistral.embeddings.create({
  inputs: ['The quick brown fox jumped over the lazy dog'],
  model: 'mistral-embed'
})
console.log(result)
