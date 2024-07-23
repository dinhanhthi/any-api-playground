/**
 * From: https://docs.anthropic.com/en/api/client-sdks#typescript
 *
 * How to use?
 * node -r dotenv/config claude/streaming-sdk.js
 *
 */

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

const stream = await anthropic.messages.stream({
  model: 'claude-3-5-sonnet-20240620',
  max_tokens: 1024,
  system: 'You are an AI assistant with name Thi Dinh.',
  // messages: [{ role: 'user', content: 'Hello, Claude' }],
  messages: [
    {
      role: 'user',
      content: 'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...'
    }
  ],
})

console.log('Before log streaming')

// 1st way
// stream.on('text', text => {
//   process.stdout.write(text || '')
// })

for await (const messageStreamEvent of stream) {
  // console.log(messageStreamEvent.type);
  console.log(messageStreamEvent)
}


console.log('After log streaming')