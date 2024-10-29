/**
 * How to use?
 *
 * node -r dotenv/config xai/xai-fc.js
 */

import OpenAI from 'openai'

async function main() {
  const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })

  const body = {
    model: 'grok-beta',
    messages: [
      {
        role: 'user',
        content:
          "Hello, my name is An Tran, I'm from Vietnam, my email is antran@gmail.com. My phone is 06051211111",
      },
    ],
    tools: [
      {
        type: 'function',
        function: {
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
      },
      {
        type: 'function',
        function: {
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
      },
    ],
  }

  const completion = await client.chat.completions.create(body)
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  /* ###Thi */ console.log(`👉👉👉 completion: ${JSON.stringify(completion, null, 2)}`)

  callback()
}

main()
