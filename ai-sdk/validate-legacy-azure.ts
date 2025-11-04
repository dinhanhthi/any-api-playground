/**
 * Simple Azure OpenAI validation for legacy format
 *
 * How to run:
 * pnpm exec tsx ai-sdk/validate-legacy-azure.ts
 *
 * Environment variables needed:
 * AZURE_API_KEY=your-api-key
 * AZURE_ENDPOINT_FULL=https://ideta-gpt4.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview
 */

import 'dotenv/config'
import { createAzure } from '@ai-sdk/azure'
import { generateText } from 'ai'

const apiKey = process.env.AZURE_API_KEY || ''
const fullEndpoint = process.env.AZURE_ENDPOINT_FULL || ''

console.log('=== Azure OpenAI Legacy Format Validation ===\n')

if (!apiKey) {
  console.log('❌ AZURE_API_KEY is not set')
  process.exit(1)
}

if (!fullEndpoint) {
  console.log('❌ AZURE_ENDPOINT_FULL is not set')
  process.exit(1)
}

console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
console.log(`Full Endpoint: ${fullEndpoint}\n`)

// Extract baseURL - try including /openai path
// For https://ideta-gpt4.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview
// Try: https://ideta-gpt4.openai.azure.com/openai
const baseURLMatch = fullEndpoint.match(/(https?:\/\/[^\/]+\/openai)/)
const baseURL = baseURLMatch ? baseURLMatch[1] : ''
console.log(`Base URL: ${baseURL}`)

// Extract API version from query parameter
const apiVersionMatch = fullEndpoint.match(/api-version=([^&]+)/)
const apiVersion = apiVersionMatch ? apiVersionMatch[1] : '2024-05-01-preview'
console.log(`API Version: ${apiVersion}`)

// Extract deployment name
const deploymentMatch = fullEndpoint.match(/\/deployments\/([^\/\?]+)/)
const deploymentName = deploymentMatch ? deploymentMatch[1] : 'gpt-4o'
console.log(`Deployment Name: ${deploymentName}`)
console.log(`Use Deployment-Based URLs: true\n`)

// Create Azure provider with deployment-based URLs
const instanceSettings = {
  apiKey,
  baseURL,
  apiVersion,
  useDeploymentBasedUrls: true,
}
console.log(`👉👉👉 instanceSettings: `, JSON.stringify(instanceSettings, null, 2))
const azure = createAzure(instanceSettings)

console.log('Testing connection...\n')

const startTime = Date.now()

generateText({
  model: azure(deploymentName),
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
          service: 'Azure OpenAI (Legacy)',
          valid: true,
          response: result.text,
          duration,
          deployment: deploymentName,
          apiVersion,
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
