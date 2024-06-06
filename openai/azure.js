/**
 * Source (mofiied): https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-javascript#create-a-sample-application
 *
 * How to use?
 *
 * node -r dotenv/config openai/azure.js
 */

import { AzureOpenAI } from "openai";

// Load the .env file if it exists
import { config } from "dotenv";
config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_API_KEY"] || "<api key>";
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o"; //This must match your deployment name.
import "dotenv/config";

async function main() {

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  const result = await client.chat.completions.create({
    messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
    { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI?" },
    { role: "user", content: "Do other Azure AI services support this too?" },
    ],
    model: "",
  });

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

export default { main };