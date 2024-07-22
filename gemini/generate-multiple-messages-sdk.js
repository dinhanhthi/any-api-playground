/**
 * From: https://ai.google.dev/gemini-api/docs/text-generation?lang=node#configure
 *
 * How to use?
 * node -r dotenv/config gemini/generate-multiple-messages-sdk.js
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
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ]

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent({
    generationConfig,
    safetySettings,
    systemInstruction: 'You are a helpful assistant with name AAAAA.',
    // contents: [
    //   {
    //     role: 'user',
    //     parts: [
    //       {
    //         text: 'Who are you?',
    //       },
    //     ],
    //   },
    // ],
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Write the first line of a story about a magic backpack.',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'In the bustling city of Meadow brook, lived a young girl named Sophie. She was a bright and curious soul with an imaginative mind.',
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            text: 'Can you set it in a quiet village in 1600s France?',
          },
        ],
      },
    ],
  })
  const response = await result.response
  console.log(JSON.stringify(response, null, 2))
  // const text = response.text()
  // console.log(text)
}

main()
