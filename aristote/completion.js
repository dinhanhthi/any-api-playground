/**
 * How to use?
 * node -r dotenv/config aristote/completion.js
 */

import got from 'got/dist/source/index.js'

async function main() {
  const res = await got
    .post('https://dispatcher.aristote.centralesupelec.fr/v1/chat/completions', {
      headers: { Authorization: `Bearer ${process.env.ARISTOTE_API_KEY}` },
      json: { model: 'casperhansen/llama-3-70b-instruct-awq', messages: [{ role: 'user', content: 'Hello' }] },
    })
    .json()

  console.log(JSON.stringify(res, null, 2))
}

main()
