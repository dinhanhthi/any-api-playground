/**
 * How to use?
 *
 * node -r dotenv/config brain/new-brain.js
 *
 */

import axios from 'axios'
import FormData from 'form-data'
import { inspect } from 'util'

async function main() {
  const token = await getToken()

  const data = {
    model: 'mistral-small-24b',
    messages: [{ role: 'user', content: 'Who are you?' }],
    stream: false,
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
  })

  console.log(inspect(response.data, { depth: null, colors: true }))
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
