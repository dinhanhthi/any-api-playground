/**
 * How to use?
 *
 * node -r dotenv/config mistral/modelList-axios.js
 *
 */

import axios from 'axios'

async function main() {
  const response = await axios
    .request({
      method: 'GET',
      url: 'https://api.mistral.ai/v1/models',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      responseType: 'json',
    })
  /* ###Thi */ console.log(`👉👉👉 response: `, response.data)
}

main()
