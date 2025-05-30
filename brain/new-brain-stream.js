/**
 * How to use?
 *
 * node -r dotenv/config brain/new-brain-stream.js
 *
 */

import axios from 'axios'
import FormData from 'form-data'

async function main() {
  const token = await getToken()

  const data = {
    model: 'mistral-small-24b',
    messages: [{ role: 'user', content: 'Count from 1 to 10' }],
    stream: true,
  }

  const callback = () => {
    console.log('\n🎉 Callback called!')
  }

  const response = await axios.request({
    method: 'post',
    url: 'https://brain-api.softlaw.ai/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      spaceId: process.env.BRAIN_SPACE_ID,
    },
    data: data,
    responseType: 'stream', // OBLIGATORY
  })

  const reader = (await response).data
  const decoder = new TextDecoder()
  let buffer = ''

  let text = ''
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
          const chunk = JSON.parse(jsonChunk)
          const message = chunk.choices?.[0]?.delta?.content || ''
          process.stdout.write(message)
          text += message
        } catch (error) {
          console.error('Failed to parse JSON chunk:', error)
        }
      }
    }
  })

  reader.on('end', () => {
    console.log('Stream ended.')
  })

  // reader.on('error', error => {
  //   console.error('Stream error:', error)
  // })
}

main()

async function getToken() {
  const form = new FormData()
  form.append('softlaw_client_id', process.env.BRAIN_SOFTLAW_CLIENT_ID)
  form.append('external_user_id', process.env.BRAIN_EXTERNAL_USER_ID)
  form.append('client_id', process.env.BRAIN_CLIENT_ID)
  form.append('client_secret', process.env.BRAIN_CLIENT_SECRET)
  form.append('pop_uri', process.env.BRAIN_POP_URI)

  const response = await axios.request({
    method: 'post',
    url: process.env.BRAIN_AUTH_ENDPOINT,
    headers: {
      ...form.getHeaders(),
    },
    data: form,
  })

  return response?.data?.access_token
}
