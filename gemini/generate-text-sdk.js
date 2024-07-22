/**
 * From: https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#generate-text-from-text-input
 *
 * How to use?
 * node -r dotenv/config gemini/generate-text-sdk.js
 *
 */
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = 'Hello, who are you?'

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log(text)
}

main()
