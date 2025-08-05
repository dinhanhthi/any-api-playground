/**
 * From: https://ai.google.dev/gemini-api/docs/function-calling/tutorial?lang=node
 *
 * How to use?
 * node -r dotenv/config gemini/old_sdk/function-calling-2nd-call.js
 *
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const generationConfig = {
    temperature: 1.0,
  }

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ]

  const systemInstruction = 'You are an useful assistant with name LUCKY.'

  const functionDeclarations = [
    {
      name: 'SPEAK_TO_HUMAN',
      description: 'Speak to a human agent',
      parameters: {
        type: 'object',
        properties: {
          reason: {
            type: 'string',
            description:
              'The reason why the user wants to speak to a human agent. This is the info the support agent will receive to start answering the issue.',
          },
        },
        required: ['reason'],
      },
    },
    {
      name: 'GET_USER_INFO',
      description:
        "Extract useful information from the user input like user's first name, last name, phone number, country,... ",
      parameters: {
        type: 'object',
        properties: {
          lastName: {
            type: 'string',
            description:
              "Get the last name of the client if it's available. For example John Doe, the last name is Doe. If use gives only 1 word, it's the first name and there is no last name.",
          },
          firstName: {
            type: 'string',
            description:
              'Get the first name of the client if it\'s available. For example John Doe, the first name is John. If user gives only one word like "Alice", it\'s the first name.',
          },
          email: {
            type: 'string',
            description:
              "Get the email of the client if it's given. For example username@company.com.",
          },
        },
        required: ['lastName', 'firstName', 'email'],
      },
    },
    {
      name: 'GET_PHONE_NUMBER',
      description: 'Extract useful information from the user input for GET_PHONE_NUMBER',
      parameters: {
        type: 'object',
        properties: {
          phoneNumber: {
            type: 'string',
            description: 'Get the phone number given by the user.',
          },
        },
        required: ['phoneNumber'],
      },
    },
    {
      name: 'GET_COUNTRY',
      description: 'Extract useful information from the user input for GET_COUNTRY',
      parameters: {
        type: 'object',
        properties: {
          country: {
            type: 'string',
            description: 'Get the country where the user comes from',
          },
        },
        required: ['country'],
      },
    },
  ]

  const prompt =
    'Hello, my name is Anh-Thi Dinh (first name is Thi, last name is Dinh). My email is "thi@ideta.io". I\'m from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.'

  // --- 1st way ---

  // const model = genAI.getGenerativeModel({
  //   model: 'gemini-1.5-flash',
  //   generationConfig,
  //   safetySettings,
  //   systemInstruction,
  //   tools: {
  //     functionDeclarations,
  //   },
  // })

  // const result = await model.generateContent(prompt)

  // --- 2nd way ---
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent({
    generationConfig,
    safetySettings,
    systemInstruction,
    tools: {
      functionDeclarations,
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  })

  // -- result --

  const response = result.response
  console.log(JSON.stringify(response, null, 2))

  // const text = response.text()
  // console.log(text)
}

main()
