/**
 * How to use?
 * node -r dotenv/config brain/chatbot.js
 */

import axios from 'axios'
import FormData from 'form-data'

async function main() {
  const token = await getToken()
  // console.log(token)

  const data = JSON.stringify({
    spaceId: process.env.BRAIN_SPACE_ID,
    conversationId: process.env.BRAIN_CONVERSATION_ID,
    text: 'Hello, my name is Thi',
    messages: [
      {
        role: 1,
        content: 'Who are you?',
      },
      {
        role: 0,
        content: 'My name is TTTTT',
      },
      {
        role: 1,
        content: 'Hi TTTTT, what did I just ask you?',
      },
    ],
  })

  const config = {
    method: 'post',
    url: process.env.BRAIN_DOMAIN + process.env.BRAIN_ENDPOINT_CHATBOT,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    data: data,
  }

  try {
    const response = await axios.request(config)
    console.log('Response:', JSON.stringify(response.data))
  } catch (error) {
    console.error('error.status:', error.status)
    console.error('error.message:', error.message)
    console.error('error.response?.statusText:', error.response?.statusText)
  }
}

main()

async function getToken() {
  let form = new FormData()
  form.append('softlaw_client_id', process.env.BRAIN_SOFTLAW_CLIENT_ID)
  form.append('external_user_id', process.env.BRAIN_EXTERNAL_USER_ID)
  form.append('client_id', process.env.BRAIN_CLIENT_ID)
  // form.append('client_secret', process.env.BRAIN_CLIENT_SECRET)
  form.append('client_secret', process.env.BRAIN_CLIENT_SECRET + 'x')
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