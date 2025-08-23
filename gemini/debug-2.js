/**
 * node -r dotenv/config gemini/debug-2.js
 */

import { GoogleGenAI } from '@google/genai'
import { inspect } from 'util'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function main() {
  const generateContentParams = {
    model: 'gemini-2.5-flash',
    contents: [
      {
        parts: [
          {
            text: "Hello, my name is Oliver Dinh (first name is Oliver, last name is Dinh). My email is harrypotter@ideta.io. I'm from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.",
          },
        ],
        role: 'user',
      },
      {
        parts: [
          {
            functionCall: {
              args: {
                email: 'harrypotter@ideta.io',
                firstName: 'Oliver',
                lastName: 'Dinh',
              },
              name: 'Nj9Yn8D7ovTLtoAZGqY',
            },
          },
        ],
        role: 'model',
      },
      {
        parts: [
          {
            functionResponse: {
              name: 'Nj9Yn8D7ovTLtoAZGqY',
              response: { content: 'Some data was displayed to the user' },
            },
          },
        ],
        role: 'user',
      },
      {
        parts: [{ text: 'My phone number is 123123213' }],
        role: 'user',
      },
      {
        role: 'model',
        parts: [
          {
            functionCall: {
              name: 'NjMi84x01DY8i7XXRk4',
              args: { phoneNumber: 123123213 },
            },
          },
        ],
      },
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: 'NjMi84x01DY8i7XXRk4',
              response: { content: 'Some data was displayed to the user' },
            },
          },
        ],
      },
      { role: 'user', parts: [{ text: "I'm from France" }] },
    ],
    config: {
      temperature: 0.1,
      systemInstruction: {
        parts: [{ text: 'You are the virtual assistant for IDETA. ' }],
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
      ],
    },
  }

  // const response = await ai.models.generateContent(generateContentParams)
  // console.log(inspect(response.candidates[0].content, { depth: null, colors: true }))

  // streaming
  const response = await ai.models.generateContentStream(generateContentParams)
  for await (const chunk of response) {
    console.log(chunk.text)
  }
}

await main()
