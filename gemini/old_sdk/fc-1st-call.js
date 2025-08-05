/**
 * From: https://ai.google.dev/gemini-api/docs/function-calling/tutorial?lang=node
 *
 * How to use?
 * node -r dotenv/config gemini/old_sdk/fc-1st-call.js
 *
 */
import { GoogleGenerativeAI } from '@google/generative-ai'
import { inspect } from 'util'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'What is the weather like in Paris today?',
          },
        ],
      },
    ],
    tools: [
      {
        function_declarations: [
          {
            name: 'get_weather',
            description: 'Get current temperature for a given location.',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'City and country e.g. Bogotá, Colombia',
                },
              },
              required: ['location'],
            },
          },
        ],
      },
    ],
  })
  const response = result.response
  console.log(inspect(response, { depth: null, colors: true }))
}

main()
