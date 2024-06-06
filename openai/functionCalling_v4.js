/**
 * This one is copied from the official openai cookbook:
 * https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models#parallel-function-calling
 *
 * How to use?
 *
 * node -r dotenv/config openai/functionCalling_v4.js
 */

import OpenAI from 'openai'

const openai = new OpenAI()

async function main() {
  const tools = [
    {
      type: 'function',
      function: {
        name: 'get_current_weather',
        description: 'Get the current weather',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
            format: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              description: 'The temperature unit to use. Infer this from the users location.',
            },
          },
          required: ['location', 'format'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_n_day_weather_forecast',
        // description: 'Get an N-day weather forecast',
        description: 'Get useful information',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
            format: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              description: 'The temperature unit to use. Infer this from the users location.',
            },
            num_days: {
              type: 'integer',
              description: 'The number of days to forecast',
            },
          },
          required: ['location', 'format', 'num_days'],
        },
      },
    },
  ]

  const messages = [
    {
      role: 'system',
      content:
        "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
    },
    {
      role: 'user',
      content:
        'what is the weather going to be like in San Francisco and Glasgow over the next 4 days',
    },
  ]

  const toolsIdeta = [
    {
      type: 'function',
      function: {
        name: '-Na5zyXmNdhvLgu5lVXW',
        description: 'Get useful information',
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
    },
    {
      type: 'function',
      function: {
        name: '-Nj9Yn8D7ovTLtoAZGqY',
        description: 'Get useful information',
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
    },
    {
      type: 'function',
      function: {
        name: '-NjMi84x01DY8i7XXRk4',
        description: 'Get useful information',
        parameters: {
          type: 'object',
          properties: {
            phoneNumber: {
              type: 'number',
              description: 'Get the phone number given by the user.',
            },
          },
          required: ['phoneNumber'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: '-NjMvtCGJN4HoXREUteI',
        description: 'Extract useful information from the user input',
        parameters: {
          type: 'object',
          properties: {
            country: {
              type: 'string',
              description: 'Get the country where the user comes from.',
            },
          },
          required: ['country'],
        },
      },
    },
  ]

  const messagesIdeta = [
    {
      role: 'system',
      // content:
      //   "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
      content:
        "You are a customer success manager at a company called Ideta. They have 4 main products :\n- livechat\n- chatbot\n- Linkedin AI assistant\n- Auto commenter on Facebook and Instagram.\nThe company was founded in 2017 by Sarah Martineau (CEO) and Yanis Kerdjana (CTO).\nIf customers ask how to integrate the chatbot on their website, send them that link : https://fr.ideta.io/blog-posts-english/chatbot-integrations-all-platform .\nIf they ask about the pricing, send them to : https://ideta.io/pricing .\nNever mention you being an Open AI model.\nYour name is Anh Thi Dinh.\nDon't answer questions about Ideta's competition.\nThe answer should be 50 words long max.\nAt the end of every message, ask if the customer is satisfied with the answer. If the customer is not satisfied, send that link : https://www.ideta.io/contact.",
    },
    {
      role: 'user',
      content:
        'Hello, my name is Anh-Thi Dinh (first name is Thi, last name is Dinh). My email is "thi@ideta.io". I\'m from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.',
      // content:
      //   'Hello, my name is Anh-Thi Dinh (first name is Thi, last name is Dinh). My email is \"thi@ideta.io\". I\'m from Vietnam and my phone number is 4242424242.',
    },
  ]

  const request = {
    // model: 'gpt-3.5-turbo-1106',
    model: 'gpt-4-1106-preview',
    max_tokens: 150, // ERROR!
    temperature: 1,
    top_p: 1,
    n: 1,
    // messages,
    // tools,
    messages: messagesIdeta,
    tools: toolsIdeta,
    tool_choice: 'auto',
  }

  const response = await openai.chat.completions.create(request)
  console.log(JSON.stringify(response, null, 2))
}

main()
