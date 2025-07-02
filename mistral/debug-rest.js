/**
 * https://github.com/mistralai/client-js
 * https://github.com/mistralai/client-ts
 *
 * node -r dotenv/config mistral/debug-rest.js
 */

import axios from 'axios'

let data = JSON.stringify({
  model: 'mistral-large-latest',
  temperature: 0.1,
  messages: [
    {
      role: 'system',
      content: 'Your name is Mistral Dinh. Your email is xxx@yyy.com',
    },
    {
      role: 'user',
      content: 'What is the weather like in Paris today?',
    },
    {
      role: 'assistant',
      tool_calls: [
        {
          id: '9q38ekEN9',
          function: {
            name: 'OU5hn26uE_2MXaePKIQ',
            arguments: '{"location": "Paris, France"}',
          },
          index: 0,
        },
      ],
    },
    {
      role: 'tool',
      tool_call_id: '9q38ekEN9',
      content: '{"temperature": "14°C (57.2°F)"}',
    },
  ],
})

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.mistral.ai/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
  },
  data: data,
}

axios
  .request(config)
  .then(response => {
    console.log(JSON.stringify(response.data, null, 2))
  })
  .catch(error => {
    console.log(error)
  })
