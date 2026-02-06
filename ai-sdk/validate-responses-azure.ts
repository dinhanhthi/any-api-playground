/**
 * Azure OpenAI validation for Responses API format (non-v1, with api-version)
 *
 * How to run:
 * pnpm exec tsx ai-sdk/validate-responses-azure.ts
 *
 * Environment variables needed:
 * AZURE_API_KEY=your-api-key
 *
 * Endpoint:
 * https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai/responses?api-version=2025-04-01-preview
 * Deployment: hep-gpt-52
 *
 * Note: This endpoint uses /openai/responses (without /v1) but the AI SDK
 * always inserts /v1 into the path. We use a custom fetch to rewrite the URL.
 *
 * Refs:
 * - Responses Models: https://ai-sdk.dev/providers/ai-sdk-providers/azure#responses-models
 * - Azure OpenAI Responses API: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/responses
 */

import 'dotenv/config'
import { createAzure } from '@ai-sdk/azure'
import { generateText } from 'ai'

const apiKey = process.env.AZURE_API_KEY || ''
const fullEndpoint =
  'https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai/responses?api-version=2025-04-01-preview'
const deploymentName = 'hep-gpt-52'

console.log('=== Azure OpenAI Responses API Validation ===\n')

if (!apiKey) {
  console.log('❌ AZURE_API_KEY is not set')
  process.exit(1)
}

console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
console.log(`Full Endpoint: ${fullEndpoint}`)
console.log(`Deployment Name: ${deploymentName}\n`)

// Extract baseURL: https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai
const baseURLMatch = fullEndpoint.match(/(https?:\/\/[^\/]+\/openai)/)
const baseURL = baseURLMatch ? baseURLMatch[1] : ''
console.log(`Base URL: ${baseURL}`)

// Extract API version from query parameter
const apiVersionMatch = fullEndpoint.match(/api-version=([^&]+)/)
const apiVersion = apiVersionMatch ? apiVersionMatch[1] : '2025-04-01-preview'
console.log(`API Version: ${apiVersion}`)

// The SDK constructs URLs as: {baseURL}/v1{path}?api-version={apiVersion}
// But this endpoint needs: {baseURL}/responses?api-version=2025-04-01-preview
// So we use a custom fetch to rewrite /v1/responses -> /responses
const customFetch: typeof globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url
  const rewrittenUrl = url.replace('/openai/v1/', '/openai/')
  console.log(`🔄 URL rewrite: ${url}`)
  console.log(`   ➜ ${rewrittenUrl}`)
  return globalThis.fetch(rewrittenUrl, init)
}

const instanceSettings = {
  apiKey,
  baseURL,
  apiVersion,
  fetch: customFetch,
}
console.log(`\n👉👉👉 instanceSettings (without fetch): `, JSON.stringify({ apiKey: instanceSettings.apiKey, baseURL: instanceSettings.baseURL, apiVersion: instanceSettings.apiVersion }, null, 2))

const azure = createAzure(instanceSettings)

// Use azure.responses() since this is a Responses API endpoint
const model = azure.responses(deploymentName)

console.log('\nTesting connection...\n')

const startTime = Date.now()

generateText({
  model,
  prompt: 'Hello, who are you?',
  maxOutputTokens: 50,
})
  .then((result) => {
    const duration = Date.now() - startTime

    console.log(`\n👉👉👉 result: `, JSON.stringify(result, null, 2))
    console.log(`\nResponse: ${result.text}`)
    console.log(`Duration: ${duration}ms`)
    console.log(`\n✅ Status: VALID`)

    console.log('\n=== Summary ===')
    console.log(
      JSON.stringify(
        {
          service: 'Azure OpenAI (Responses API)',
          valid: true,
          response: result.text,
          duration,
          deployment: deploymentName,
          apiVersion,
          modelType: 'responses',
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
