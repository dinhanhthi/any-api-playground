/**
 * Copied from https://platform.openai.com/docs/api-reference/chat/create?lang=node.js
 *
 *  How to use?
 *
 * node -r dotenv/config mistral/streaming.js
 *
 */

async function main() {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: {
        model: 'mistral-large-latest',
        stream: true,
        messages: [
          {
            role: 'system',
            content: 'You are a customer success manager at a company called Ideta.',
          },
          {
            content:
              'Count to 10, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
            role: 'user',
          },
        ],
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    let receivedLength = 0
    let chunks = []

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        console.log('Stream complete')
        break
      }

      receivedLength += value.length
      chunks.push(value)

      const chunkString = decoder.decode(value, { stream: true })
      console.log(`Received chunk: ${chunkString}`)

      // Process chunkString (e.g., append it to the DOM, process JSON, etc.)
    }
  } catch (error) {
    // console.error('Error fetching stream:', error)
    console.log(error)
  }
}

main()
