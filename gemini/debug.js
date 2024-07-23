/**
 * From: https://ai.google.dev/gemini-api/docs/text-generation?lang=node#configure
 *
 * How to use?
 * node -r dotenv/config gemini/debug.js
 *
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const configs = {
    generationConfig: {
      temperature: 0.1,
    },
    system_instruction: {
      parts: {
        text: 'You are the virtual assistant for IDETA.',
      },
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Count to 100, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
            // text: 'Hello, who are you?',
          },
        ],
      },
    ],
    safetySettings: [
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
    tools: [
      {
        function_declarations: [
          {
            name: 'Nj9Yn8D7ovTLtoAZGqY',
            description: 'Get the full name and email of the user.',
            parameters: {
              type: 'object',
              properties: {
                lastName: {
                  type: 'string',
                  description: "Get the last name of the client if it's available.",
                },
                firstName: {
                  type: 'string',
                  description: "Get the first name of the client if it's available.",
                },
                email: {
                  type: 'string',
                  description: "Get the email of the client if it's available.",
                },
              },
              required: ['lastName', 'firstName', 'email'],
            },
          },
          {
            name: 'NjMi84x01DY8i7XXRk4',
            description: 'Get the phone number of the user.',
            parameters: {
              type: 'object',
              properties: {
                phoneNumber: {
                  type: 'number',
                  description: 'Get the phone number from the user input.',
                },
              },
              required: ['phoneNumber'],
            },
          },
          {
            name: 'NjMvtCGJN4HoXREUteI',
            description: 'Get the country where the user come from',
            parameters: {
              type: 'object',
              properties: {
                country: {
                  type: 'string',
                  description: 'Get the country where the user come from',
                },
              },
              required: ['country'],
            },
          },
        ],
      },
    ],
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent(configs)
  const response = result.response
  console.log(JSON.stringify(response, null, 2))
  // const text = response.text()
  // console.log(text)
}

main()
