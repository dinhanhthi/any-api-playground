/**
 * From: https://docs.anthropic.com/en/api/client-sdks#typescript
 *
 * How to use?
 * node -r dotenv/config claude/messages-sdk.js
 *
 */

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

const promise = await anthropic.messages.create({
  // model: 'claude-3-5-sonnet-20240620',
  // model: 'claude-3-haiku-20240307',
  model: 'claude-sonnet-4-0',
  max_tokens: 1024,
  // system: 'You are an AI assistant with name Thi Dinh.',
  messages: [{ role: 'user', content: 'Hello, Claude' }],
  // messages: [
  //   {
  //     role: 'user',
  //     content: 'Hello, my name is Lala. Who are you?',
  //   },
  //   {
  //     role: 'assistant',
  //     content:
  //       "I am an AI assistant called Claude created by Anthropic to be helpful, harmless, and honest. I don't have a physical body or image.",
  //   },
  //   {
  //     role: 'user',
  //     content: 'Do you know my name?',
  //   },
  // ],
})

console.log(promise)
