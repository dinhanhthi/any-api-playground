/**
 * Ref: https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#streaming
 *
 * How to use?
 * node -r dotenv/config gemini/streaming-sdk.js
 *
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = 'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...'

  const result = (await model.generateContentStream(prompt)).stream

  let text = ''
  for await (const chunk of result) {
    const chunkText = chunk.text()
    process.stdout.write(chunkText || '')
    text += chunkText
  }

  // console.log(`----Final text: ${text}`)
}

main()
