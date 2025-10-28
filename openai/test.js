import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: null
});

const response = await client.models.retrieve('gpt-4o-realtime-preview-2025-06-03');

console.log(response);