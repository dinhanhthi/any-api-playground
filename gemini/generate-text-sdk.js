/**
 * From: https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#generate-text-from-text-input
 *
 * How to use?
 * node -r dotenv/config gemini/generate-text-sdk.js
 *
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const generationConfig = {
    // "stopSequences": ["Title"],
    temperature: 1.0,
    // "maxOutputTokens": 800,
    // "topP": 0.8,
    // "topK": 10
  }

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const systemInstruction = 'You are a helpful assistant.'

  // We can put all settings inside generateContent() instead
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig, safetySettings, systemInstruction })

  const prompt = 'Hello, who are you?'

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log(text)
}

main()
