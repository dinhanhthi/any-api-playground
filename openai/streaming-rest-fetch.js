/**
 * How to use?
 *
 * node -r dotenv/config openai/streaming-rest-fetch.js
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
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })

    // Process each line in the buffer
    let lines = buffer.split('\n')
    buffer = lines.pop() // Keep the last part in buffer if it's incomplete

    for (let line of lines) {
      if (line.startsWith('data: ')) {
        let jsonChunk = line.substring(6) // Remove the "data: " prefix
        if (jsonChunk === '[DONE]') {
          callback()
          return
        }
        try {
          let chunk = JSON.parse(jsonChunk)
          // console.log(chunk) // Log the JSON object
          process.stdout.write(chunk.choices?.[0]?.delta?.content || '')
        } catch (error) {
          console.error('Failed to parse JSON chunk:', error)
        }
      }
    }
    // console.log(decoder.decode(value).replace(/\n/g, ''))
    // if (buffer) {
    //   try {
    //     let chunk = JSON.parse(buffer)
    //     // console.log(chunk, null, 2)
    //     process.stdout.write(chunk.choices?.[0]?.delta?.content || '')
    //   } catch (error) {
    //     console.error('Failed to parse JSON chunk:', error)
    //   }
    // }
  }
}

main()
