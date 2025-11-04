/**
 * Simple Azure OpenAI validation for v1 format
 *
 * How to run:
 * pnpm exec tsx ai-sdk/validate-v1-azure.ts
 *
 * Environment variables needed:
 * AZURE_API_KEY=your-api-key
 * AZURE_ENDPOINT_FULL=https://bymycarai.openai.azure.com/openai/v1/responses
 *
 * Or alternatively:
 * AZURE_API_KEY=your-api-key
 * AZURE_RESOURCE_NAME=bymycarai
 * AZURE_DEPLOYMENT_NAME=gpt-4o
 * 
 * Refs:
 * - Responses Models: https://ai-sdk.dev/providers/ai-sdk-providers/azure#responses-models
 * - Azure OpenAI Responses API: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/responses
 */

import 'dotenv/config'
import { createAzure } from '@ai-sdk/azure'
import { generateText } from 'ai'

const apiKey = process.env.AZURE_API_KEY || ''
const fullEndpoint = process.env.AZURE_ENDPOINT_FULL || ''
const resourceName = null
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME || 'gpt-4o'

console.log('=== Azure OpenAI v1 Format Validation ===\n')

if (!apiKey) {
  console.log('❌ AZURE_API_KEY is not set')
  process.exit(1)
}

console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)

let azure: ReturnType<typeof createAzure>
let extractedDeploymentName = deploymentName
let isResponsesModel = false

// Check if full endpoint is provided
if (fullEndpoint) {
  console.log(`Full Endpoint: ${fullEndpoint}\n`)

  // Detect if this is a responses endpoint
  isResponsesModel = fullEndpoint.includes('/v1/responses')
  console.log(`Model Type: ${isResponsesModel ? 'Responses Model' : 'Chat Completions Model'}`)

  // Extract baseURL from full endpoint
  // For https://bymycarai.openai.azure.com/openai/v1/responses
  // Extract: https://bymycarai.openai.azure.com/openai
  // (SDK will append /v1{path} automatically)
  const baseURLMatch = fullEndpoint.match(/(https?:\/\/[^\/]+\/openai)/)
  const baseURL = baseURLMatch ? baseURLMatch[1] : ''
  console.log(`Base URL: ${baseURL}`)
  console.log(`Note: SDK will construct final URL as: ${baseURL}/v1{path}`)

  // Extract resource name from the URL
  const resourceMatch = fullEndpoint.match(/https?:\/\/([^.]+)\.openai\.azure\.com/)
  const extractedResourceName = resourceMatch ? resourceMatch[1] : ''
  console.log(`Resource Name: ${extractedResourceName}`)

  // Try to extract deployment name from path if present
  const deploymentMatch = fullEndpoint.match(/\/deployments\/([^\/\?]+)/)
  if (deploymentMatch) {
    extractedDeploymentName = deploymentMatch[1]
  }
  console.log(`Deployment Name: ${extractedDeploymentName}\n`)

  // Create Azure provider with v1 format using baseURL
  const instanceSettings = {
    apiKey,
    baseURL,
  }
  console.log(`👉👉👉 instanceSettings: `, JSON.stringify(instanceSettings, null, 2))
  azure = createAzure(instanceSettings)
} else if (resourceName) {
  // Use resourceName format
  console.log(`Resource Name: ${resourceName}`)
  console.log(`Deployment Name: ${extractedDeploymentName}\n`)

  const instanceSettings = {
    apiKey,
    resourceName,
  }
  console.log(`👉👉👉 instanceSettings: `, JSON.stringify(instanceSettings, null, 2))
  azure = createAzure(instanceSettings)
} else {
  console.log('❌ Either AZURE_ENDPOINT_FULL or AZURE_RESOURCE_NAME must be set')
  process.exit(1)
}

console.log('Testing connection...\n')

const startTime = Date.now()

// Use appropriate method based on model type
// azure.responses() for v1 responses endpoint
// azure() for regular chat completions
const model = isResponsesModel
  ? azure.responses(extractedDeploymentName)
  : azure(extractedDeploymentName)

generateText({
  model,
  prompt: 'Say "Azure validation successful" in exactly 4 words.',
  maxOutputTokens: 50,
})
  .then((result) => {
    const duration = Date.now() - startTime

    console.log(`Response: ${result.text}`)
    console.log(`Duration: ${duration}ms`)
    console.log(`\n✅ Status: VALID`)

    console.log('\n=== Summary ===')
    console.log(
      JSON.stringify(
        {
          service: 'Azure OpenAI (v1)',
          valid: true,
          response: result.text,
          duration,
          deployment: extractedDeploymentName,
          format: 'v1',
          modelType: isResponsesModel ? 'responses' : 'chat-completions',
        },
        null,
        2
      )
    )

    process.exit(0)
  })
  .catch((error) => {
    console.log(`\n❌ Status: INVALID`)
    console.log(`Error: ${error.message}`)

    process.exit(1)
  })
