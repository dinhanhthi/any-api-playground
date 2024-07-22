/**
 * How to use?
 *
 * node -r dotenv/config mistral/streaming-rest-axios.js
 *
 */

import axios from 'axios'

async function main() {
  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  let data = JSON.stringify({
    model: 'mistral-large-latest',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are a customer success manager at a company called Ideta.',
      },
      {
        content:
          'Count to 100, with a comma between each number and no newlines. E.g., 1, 2, 3, ...',
        role: 'user',
      },
    ],
  })

  let config = {
    method: 'post',
    url: 'https://api.mistral.ai/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    data: data,
    responseType: 'stream',
  }

  const response = await axios(config)
  // /* ###Thi */ console.log(`👉👉👉 response: `, response.data);
  const reader = response.data
  const decoder = new TextDecoder()
  let buffer = ''

  reader.on('data', chunk => {
    buffer += decoder.decode(chunk, { stream: true })
    let lines = buffer.split('\n')
    buffer = lines.pop() // Keep the last part in buffer if it's incomplete

    for (let line of lines) {
      if (line.startsWith('data: ')) {
        let jsonChunk = line.substring(6) // Remove the "data: " prefix
        if (jsonChunk === '[DONE]') {
          callback()
          reader.destroy() // Close the stream
          return
        }
        try {
          let chunk = JSON.parse(jsonChunk)
          // console.log(chunk) // Log the JSON object
          // console.log(chunk.choices?.[0]?.delta?.content || '')
          process.stdout.write(chunk.choices?.[0]?.delta?.content || '')
        } catch (error) {
          console.error('Failed to parse JSON chunk:', error)
        }
      }
    }
  })

  reader.on('end', () => {
    // Handle any remaining data in the buffer
    if (buffer) {
      try {
        let parsedChunk = JSON.parse(buffer)
        console.log(parsedChunk)
      } catch (error) {
        console.error('Failed to parse JSON chunk:', error)
      }
    }
    console.log('Stream ended.')
  })

  reader.on('error', error => {
    console.error('Stream error:', error)
  })
}

main()
