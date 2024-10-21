/**
 * How to use?
 * node -r dotenv/config brain/chatbotinit.js
 */

import axios from 'axios'
import FormData from 'form-data'

async function main() {
  let token = 'abc'
  try {
    // const token = await getToken()
    // console.log(token)

    const res = await init(token)
    console.log('Response:', JSON.stringify(res))
  } catch (error) {
    // console.error('Error:', error)
    if (error.status === 401) {
      console.error('Unauthorized. Try again...')
      token = await getToken()
      const res = await init(token)
      console.log('Response:', JSON.stringify(res))
    }
  }
}

async function init(token) {
  const response = await axios.request({
    method: 'get',
    url: `${process.env.BRAIN_DOMAIN + process.env.BRAIN_ENDPOINT_INIT}?spaceId=${
      process.env.BRAIN_SPACE_ID
    }`,
    headers: { Authorization: token },
  })
  return response.data
}

main()

async function getToken() {
  let form = new FormData()
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
