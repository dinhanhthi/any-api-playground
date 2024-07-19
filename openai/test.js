const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
myHeaders.append('api-key', process.env.AZURE_API_KEY)

const raw = JSON.stringify({
  stream: true,
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: 'Does Azure OpenAI support customer managed keys?',
    },
    {
      role: 'assistant',
      content: 'Yes, customer managed keys are supported by Azure OpenAI.',
    },
    {
      role: 'user',
      content: 'Do other Azure AI services support this too?',
    },
  ],
})

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow',
}

// fetch(process.env.AZURE_ENDPOINT_4O, requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

fetch(process.env.AZURE_ENDPOINT_4O, requestOptions)
  .then(async response => {
    const reader = response.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // console.log(new TextDecoder().decode(value))
      const chunk = new TextDecoder().decode(value)
      const json = chunk?.replace('data: ', '') ? JSON.parse(chunk?.replace('data: ', '')) : {}
      // console.log(JSON.parse(chunk?.replace('data: ', '')))
      console.log(json.choices?.[0]?.delta?.content)
    }
  })
  .catch(error => console.error(error))

// fetch(process.env.AZURE_ENDPOINT_4O, requestOptions)
//   .then(async response => {
//     const reader = response.body.getReader()
//     let accumulatedText = '' // Accumulate chunks here
//     while (true) {
//       const { done, value } = await reader.read()
//       if (done) break
//       // Accumulate the chunk
//       accumulatedText += new TextDecoder().decode(value)
//       try {
//         // Try to parse the accumulated text as JSON
//         const json = JSON.parse(accumulatedText)
//         // If there's a delta, log it and reset accumulatedText if you expect more JSON objects
//         if (json.delta) {
//           console.log(json.delta)
//           accumulatedText = '' // Reset if you're expecting more data
//         }
//       } catch (error) {
//         // Parsing failed, likely because the JSON is incomplete. Continue accumulating.
//         console.log('Accumulating more data...')
//       }
//     }
//   })
//   .catch(error => console.error(error))
