/**
 * node -r dotenv/config gemini/embedding.js
 */

import { GoogleGenAI } from '@google/genai'
import { inspect } from 'util'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function main() {
  const text = 'Hello World!'
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 10 },
  })
  console.log(result.embeddings)
}

await main()
