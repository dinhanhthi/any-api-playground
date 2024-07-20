/**
 * Copied from https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
 *
 *  How to use?
 *
 * node -r dotenv/config openai/streaming-rest.js
 *
 */

// import got from 'got/dist/source/index.js'

async function main() {
  const data = {
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content:
          'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
      },
    ],
    stream: true,
  }

  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(data),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    console.log(decoder.decode(value).replace(/\n/g, ''))
  }
}

main()
