/**
 * Source (mofiied): https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-javascript#create-a-sample-application
 *
 * How to use?
 *
 * node -r dotenv/config azure/embedding.js
 */

import { AzureOpenAI } from 'openai'
import { config } from 'dotenv'
import 'dotenv/config'

config()

const azureEndpoint = process.env['AZURE_EMBEDDING_ENDPOINT']
const apiKey = process.env['AZURE_EMBEDDING_API']

const { endpoint, deployment, apiVersion } = extractAzureEndpoint(azureEndpoint)

async function main() {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment })

  const result = await client.embeddings.create({
    input: 'The quick brown fox jumped over the lazy dog',
    encoding_format: 'float',
    model: '',
  })

  console.log(result)
  // console.log(result?.data?.[0]?.embedding?.slice(0, 10))
  // console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error('The sample encountered an error:', err)
})

export default { main }

function extractAzureEndpoint(url) {
  const regex =
    /((https?:\/\/)?[^/]+)\/openai\/deployments\/([^/]+)\/[^?]*(?:\?api-version=([^&]+))?/
  const match = url.match(regex)

  if (match) {
    const endpoint = match[1]
    const deployment = match[3]
    const apiVersion = match[4] || null // Set version to null if not present

    return {
      endpoint,
      deployment,
      apiVersion,
    }
  } else {
    return null
  }
}
