/**
 * From: https://ai.google.dev/gemini-api/docs/function-calling/tutorial?lang=node
 *
 * How to use?
 * node -r dotenv/config gemini/old_sdk/multi-fcs-2nd-call.js
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
      // First response from model
      {
        role: 'model',
        parts: [
          {
            functionCall: {
              name: 'get_information',
              args: {
                email: 'hahalala@gmail.com',
                country: 'Vietnam',
                full_name: 'Dieu Dinh',
              },
            },
          },
          {
            functionCall: {
              name: 'get_phone_number',
              args: { phone_number: '12345678' },
            },
          },
        ],
      },
      // Function result
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: 'get_information',
              response: {
                content: 'Based on your information, an username is automatically generated as dieu_dinh_vietnam.',
              },
            },
          },
          {
            functionResponse: {
              name: 'get_phone_number',
              response: {
                content: 'Your password is the last 3 digits of your phone number: 678.',
              },
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
