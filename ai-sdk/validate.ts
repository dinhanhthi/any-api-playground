/**
 * Validate AI service API keys and models
 *
 * How to run:
 * pnpm exec tsx ai-sdk/validate.ts --service=openai
 * pnpm exec tsx ai-sdk/validate.ts --service=gemini --model=gemini-1.5-pro
 * pnpm exec tsx ai-sdk/validate.ts --service=anthropic
 * pnpm exec tsx ai-sdk/validate.ts --service=azure
 * pnpm exec tsx ai-sdk/validate.ts --service=mistral --model=mistral-large-latest
 *
 * Azure Configuration:
 * The script automatically detects the Azure endpoint format from AZURE_ENDPOINT_FULL:
 *
 * 1. Legacy format (deployment-based):
 *    AZURE_ENDPOINT_FULL=https://ideta-gpt4.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview
 *    The API version is automatically extracted from the URL query parameter
 *
 * 2. Modern format (resource name):
 *    AZURE_ENDPOINT_FULL=ideta-gpt4
 *
 * 3. Custom baseURL:
 *    AZURE_ENDPOINT_FULL=https://your-custom-endpoint.com
 */

import { createAnthropic } from '@ai-sdk/anthropic'
import { createAzure } from '@ai-sdk/azure'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import 'dotenv/config'

// Service configuration type
type ServiceConfig = {
  name: string
  envKey: string
  modelName: string
  createProvider: (apiKey: string) => any
  additionalEnv?: string[]
}

// Detect Azure endpoint format
type AzureEndpointFormat = 'legacy' | 'modern' | 'baseURL'

function detectAzureEndpointFormat(endpoint: string): AzureEndpointFormat {
  // Legacy format: https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=...
  if (endpoint.includes('/openai/deployments/')) {
    return 'legacy'
  }
  // Modern format with resourceName: just the resource name (e.g., "ideta-gpt4")
  // or a full baseURL that doesn't match legacy pattern
  return endpoint.includes('http') ? 'baseURL' : 'modern'
}

// Extract API version from Azure endpoint URL
function extractAzureApiVersion(endpoint: string): string {
  const match = endpoint.match(/api-version=([^&]+)/)
  return match ? match[1] : '2024-05-01-preview'
}

// Service configurations
const serviceConfigs: Record<string, ServiceConfig> = {
  openai: {
    name: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    modelName: 'gpt-4o-mini',
    createProvider: (apiKey: string) => createOpenAI({ apiKey }),
  },
  gemini: {
    name: 'Google Gemini',
    envKey: 'GEMINI_API_KEY',
    modelName: 'gemini-2.5-flash',
    createProvider: (apiKey: string) => createGoogleGenerativeAI({ apiKey }),
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    envKey: 'ANTHROPIC_API_KEY',
    modelName: 'claude-haiku-4-5',
    createProvider: (apiKey: string) => createAnthropic({ apiKey }),
  },
  azure: {
    name: 'Azure OpenAI',
    envKey: 'AZURE_API_KEY',
    modelName: 'gpt-4o-mini',
    createProvider: (apiKey: string) => {
      const azureEndpoint = process.env.AZURE_ENDPOINT_FULL || ''
      const format = detectAzureEndpointFormat(azureEndpoint)

      if (format === 'legacy') {
        // Legacy format: https://ideta-gpt4.openai.azure.com/openai/deployments/gpt4/chat/completions?api-version=2024-05-01-preview
        // Extract baseURL (domain + /openai: https://ideta-gpt4.openai.azure.com/openai)
        const urlMatch = azureEndpoint.match(/(https?:\/\/[^\/]+\/openai)/)
        const baseURL = urlMatch ? urlMatch[1] : ''
        const apiVersion = extractAzureApiVersion(azureEndpoint)

        return createAzure({
          apiKey,
          baseURL,
          apiVersion,
          useDeploymentBasedUrls: true,
        })
      } else if (format === 'baseURL') {
        // Custom baseURL format
        return createAzure({
          apiKey,
          baseURL: azureEndpoint,
        })
      } else {
        // Modern format: use resourceName
        return createAzure({
          apiKey,
          resourceName: azureEndpoint,
        })
      }
    },
    additionalEnv: ['AZURE_ENDPOINT_FULL'],
  },
  mistral: {
    name: 'Mistral AI',
    envKey: 'MISTRAL_API_KEY',
    modelName: 'mistral-small-latest',
    createProvider: (apiKey: string) => createMistral({ apiKey }),
  },
}

// Parse command line arguments
function parseArgs(): { service: string; model?: string } {
  const args = process.argv.slice(2)
  const serviceArg = args.find(arg => arg.startsWith('--service='))
  const modelArg = args.find(arg => arg.startsWith('--model='))

  if (!serviceArg) {
    console.error('Error: --service parameter is required')
    console.log('\nAvailable services:', Object.keys(serviceConfigs).join(', '))
    console.log('\nUsage: pnpm exec tsx ai-sdk/validate.ts --service=<service> [--model=<model>]')
    process.exit(1)
  }

  const service = serviceArg.split('=')[1]

  if (!serviceConfigs[service]) {
    console.error(`Error: Unknown service "${service}"`)
    console.log('\nAvailable services:', Object.keys(serviceConfigs).join(', '))
    process.exit(1)
  }

  const model = modelArg ? modelArg.split('=')[1] : undefined

  return { service, model }
}

// Validate API key and model
async function validateService(serviceName: string, modelName?: string) {
  const config = serviceConfigs[serviceName]

  // For Azure legacy format, extract deployment name from URL if model not specified
  let modelToTest = modelName || config.modelName
  if (serviceName === 'azure' && !modelName) {
    const azureEndpoint = process.env.AZURE_ENDPOINT_FULL || ''
    if (azureEndpoint.includes('/deployments/')) {
      const deploymentMatch = azureEndpoint.match(/\/deployments\/([^\/\?]+)/)
      if (deploymentMatch) {
        modelToTest = deploymentMatch[1]
      }
    }
  }

  console.log(`\n=== Validating ${config.name} ===\n`)

  // Check if API key exists
  const apiKey = process.env[config.envKey]
  if (!apiKey) {
    console.log(`Status: ❌ INVALID`)
    console.log(`Reason: Environment variable ${config.envKey} is not set`)
    return {
      service: config.name,
      valid: false,
      error: `${config.envKey} not set`,
    }
  }

  console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)

  // Check additional environment variables if required
  if (config.additionalEnv) {
    for (const envVar of config.additionalEnv) {
      const value = process.env[envVar]
      if (!value) {
        console.log(`Status: ❌ INVALID`)
        console.log(`Reason: Environment variable ${envVar} is not set`)
        return {
          service: config.name,
          valid: false,
          error: `${envVar} not set`,
        }
      }

      // For Azure, show the detected format
      if (serviceName === 'azure' && envVar === 'AZURE_ENDPOINT_FULL') {
        const format = detectAzureEndpointFormat(value)
        console.log(`${envVar}: ${value}`)
        console.log(`Azure Format: ${format}`)
        if (format === 'legacy') {
          const apiVersion = extractAzureApiVersion(value)
          console.log(`API Version: ${apiVersion}`)
        }
      } else {
        console.log(`${envVar}: ${value}`)
      }
    }
  }

  console.log(`Model: ${modelToTest}${modelName ? ' (custom)' : ' (default)'}`)

  try {
    // Create provider
    const provider = config.createProvider(apiKey)

    // Test with a simple generation
    const startTime = Date.now()
    const result = await generateText({
      model: provider(modelToTest),
      prompt: 'Say "API validation successful" in exactly 4 words.',
      maxOutputTokens: 50,
    })
    const duration = Date.now() - startTime

    console.log(`\nResponse: ${result.text}`)
    console.log(`Duration: ${duration}ms`)
    console.log(`Status: ✅ VALID`)

    return {
      service: config.name,
      valid: true,
      response: result.text,
      duration,
      model: modelToTest,
    }
  } catch (error: any) {
    console.log(`Status: ❌ INVALID`)
    console.log(`Error: ${error.message}`)

    return {
      service: config.name,
      valid: false,
      error: error.message,
    }
  }
}

// Main execution
async function main() {
  const { service, model } = parseArgs()
  const result = await validateService(service, model)

  console.log('\n=== Summary ===')
  console.log(JSON.stringify(result, null, 2))

  // Exit with appropriate code
  process.exit(result.valid ? 0 : 1)
}

main()
