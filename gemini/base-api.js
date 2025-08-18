/**
 * node -r dotenv/config gemini/base-api.js
 */

import { GoogleGenAI } from '@google/genai'
import { inspect } from 'util'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function main() {
  const generationConfig = {
    maxOutputTokens: 1000,
    temperature: 0.5,
    topP: 0.95
  }

  const safetySettings = [
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE'
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE'
    }
  ];


  const generateContentParams = {
    model: 'gemini-2.5-flash',
    contents: 'Count from 1 to 50',
    config: {
      generationConfig,
      safetySettings,
    },
  }

  const response = await ai.models.generateContent(generateContentParams)
  // console.log(response.text)
  console.log(inspect(response.candidates[0].content, { depth: null, colors: true }))

  // streaming
  // const response = await ai.models.generateContentStream(generateContentParams)
  // for await (const chunk of response) {
  //   console.log(chunk.text)
  // }
}

await main()
