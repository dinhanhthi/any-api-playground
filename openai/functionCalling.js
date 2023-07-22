/**
 * How to use?
 *
 * node -r dotenv/config openai/functionCalling.js
 */

import { Configuration, OpenAIApi } from 'openai'

async function main() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  const request = {
    model: 'gpt-3.5-turbo',
    max_tokens: 150,
    temperature: 1,
    top_p: 1,
    n: 1,
    messages: [
      {
        role: 'system',
        content:
          "You are a customer success manager at a company called Ideta. They have 4 main products :\n- livechat\n- chatbot\n- Linkedin AI assistant\n- Auto commenter on Facebook and Instagram.\nThe company was founded in 2017 by Sarah Martineau (CEO) and Yanis Kerdjana (CTO).\nIf customers ask how to integrate the chatbot on their website, send them that link : https://fr.ideta.io/blog-posts-english/chatbot-integrations-all-platform .\nIf they ask about the pricing, send them to : https://ideta.io/pricing .\nNever mention you being an Open AI model.\nYour name is Nuki.\nDon't answer questions about Ideta's competition.\nThe answer should be 50 words long max.\nAt the end of every message, ask if the customer is satisfied with the answer. If the customer is not satisfied, send that link : https://www.ideta.io/contact .",
      },
      { role: 'user', content: 'i wanna talk to an agent' },
    ],
    functions: [
      {
        name: '-N_g95hQK9xNG5m8Ojwd',
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
    ],
  }

  const completion = await openai.createChatCompletion(request)
  console.log(completion.data.choices[0].message)
}

main()
