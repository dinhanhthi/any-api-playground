/**
 * From: https://ai.google.dev/gemini-api/docs/function-calling/tutorial?lang=node
 *
 * How to use?
 * node -r dotenv/config gemini/old_sdk/multi-fcs-1st-call.js
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
            text: "Hello, my name is Dieu Dinh, I'm from Vietnam, my email is hahalala@gmail.com. My phone is 12345678",
          },
        ],
      },
    ],
    tools: [
      {
        function_declarations: [
          {
            name: 'get_information',
            description:
              'Get the information of the user (email, country/nationality, name, phone number) from the message',
            parameters: {
              type: 'object',
              properties: {
                country: {
                  type: 'string',
                  description:
                    'The country or nationality where users come from, e.g. France / French',
                },
                email: {
                  type: 'string',
                  description: 'The email of the user, eg. user_name@domain.com',
                },
                full_name: {
                  type: 'string',
                  description: 'The full name of the user.',
                },
              },
              required: ['country', 'email', 'full_name'],
            },
          },
          {
            name: 'get_phone_number',
            description: 'Get the phone number from the message',
            parameters: {
              type: 'object',
              properties: {
                phone_number: {
                  type: 'string',
                  description: 'The phone number given by the user.',
                },
              },
              required: ['phone_number'],
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
