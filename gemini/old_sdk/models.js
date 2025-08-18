/**
 * How to use?
 * node -r dotenv/config gemini/old_sdk/models.js
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function main() {
  const models = await genAI.list_models()
  console.log(models)
}

main()
