/**
 * How to use?
 * node -r dotenv/config gemini/model-list.js
 */

import { GoogleGenAI } from '@google/genai'

// Initialize the client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// Get list of available models
async function listModels() {
  try {
    const modelsResponse = await ai.models.list()

    // The response is a Pager object - iterate through it
    for await (const model of modelsResponse) {
      console.log('Model:', model.name)
      console.log('Display Name:', model.displayName)
      console.log('Description:', model.description)
      console.log('Input Token Limit:', model.inputTokenLimit)
      console.log('Output Token Limit:', model.outputTokenLimit)
      console.log('Supported Actions:', model.supportedActions)
      console.log('---')
    }
  } catch (error) {
    console.error('Error listing models:', error)
  }
}

listModels()
