/**
 * How to use?
 * node -r dotenv/config brain/chatbotinit.js
 */

import axios from 'axios'
import FormData from 'form-data'

let token = ''

async function main() {
  token = 'abc'
  try {
    // const token = await getToken()
    // console.log(token)

    const res = await init(token).catch(retryAfterDelay(init))
    console.log('Response (main):', JSON.stringify(res))
  } catch (error) {
    /* ###Thi */ console.log(`👉👉👉 error status: `, error.status)
    // console.error('Error:', error)
    // if (error.status === 401) {
    //   console.error('Unauthorized. Try again...')
    //   token = await getToken()
    //   const res = await init(token)
    //   console.log('Response:', JSON.stringify(res))
    // }
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

async function retryAfterDelay(promiseFn, ...args) {
  /* ###Thi */ console.log(`👉👉👉 retryAfterDelay() called`)
  const token = await getToken()
  // /* ###Thi */ console.log(`👉👉👉 new token: `, token);
  return error => {
    /* ###Thi */ console.log(`👉👉👉 err inside retry: `, error);
    if (error.status === 401) {
      /* ###Thi */ console.log(`👉👉👉 error 401 inside retry`);
      return new Promise(resolve => resolve(promiseFn.apply(this, token)))
    }
    throw error
  }
}

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
