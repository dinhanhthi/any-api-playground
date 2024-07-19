/**
 * Source (mofiied): https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-javascript#create-a-sample-application
 *
 * How to use?
 *
 * node -r dotenv/config openai/azure.js
 */

import { AzureOpenAI } from 'openai'

// Load the .env file if it exists
import { config } from 'dotenv'
config()

// You will need to set these environment variables or edit the following values
const endpoint = process.env['AZURE_ENDPOINT'] || '<endpoint>'
const apiKey = process.env['AZURE_API_KEY'] || '<api key>'
const apiVersion = '2024-05-01-preview'
const deployment = 'gpt-4o' //This must match your deployment name.
import 'dotenv/config'

async function main() {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment })
  // const res = await client.models.retrieve('gpt-4o');
  // console.log(res);

  const result = await client.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, who are you?' },
    ],
    // model: "",
  })
  console.log(result)
}

main().catch(err => {
  console.error('The sample encountered an error:', err)
})

export default { main }
