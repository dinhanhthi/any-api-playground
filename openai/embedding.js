/**
 * https://platform.openai.com/docs/api-reference/embeddings
 *
 * How to use?
 *
 * node -r dotenv/config openai/embedding.js
 */

import { OpenAI } from 'openai'
import { config } from 'dotenv'
import 'dotenv/config'

config()

async function main() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const embedding = await client.embeddings.create({
    model: 'text-embedding-ada-002',
    input: 'The quick brown fox jumped over the lazy dog',
    encoding_format: 'float',
  })

  console.log(embedding)
}

main().catch(err => {
  console.error('The sample encountered an error:', err)
})

export default { main }
