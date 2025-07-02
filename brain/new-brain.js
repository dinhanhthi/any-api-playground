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

  // const data = {
  //   // model: 'mistral-small-24b',
  //   model: 'phi-4',
  //   messages: [{ role: 'user', content: 'Who are you?' }],
  //   stream: false,
  // }

  // const data = {
  //   model: 'phi-4',
  //   temperature: 0.1,
  //   messages: [
  //     {
  //       role: 'system',
  //       content: 'You are an AI assistant from Brain of Septeo.',
  //     },
  //     { role: 'user', content: 'who are you?' },
  //   ],
  //   tools: [
  //     {
  //       type: 'function',
  //       function: {
  //         name: 'Nj9Yn8D7ovTLtoAZGqY',
  //         description: 'Get the full name and email of the user.',
  //         parameters: {
  //           type: 'object',
  //           properties: {
  //             lastName: {
  //               type: 'string',
  //               description: "Get the last name of the client if it's available.",
  //             },
  //             firstName: {
  //               type: 'string',
  //               description: "Get the first name of the client if it's available.",
  //             },
  //             email: {
  //               type: 'string',
  //               description: "Get the email of the client if it's available.",
  //             },
  //           },
  //           required: ['lastName', 'firstName', 'email'],
  //         },
  //       },
  //     }
  //     ,
  //     {
  //       type: 'function',
  //       function: {
  //         name: 'NjMi84x01DY8i7XXRk4',
  //         description: 'Get the phone number of the user.',
  //         parameters: {
  //           type: 'object',
  //           properties: {
  //             phoneNumber: {
  //               type: 'number',
  //               description: 'Get the phone number from the user input.',
  //             },
  //           },
  //           required: ['phoneNumber'],
  //         },
  //       },
  //     },
  //     {
  //       type: 'function',
  //       function: {
  //         name: 'NjMvtCGJN4HoXREUteI',
  //         description: 'Get the country where the user come from',
  //         parameters: {
  //           type: 'object',
  //           properties: {
  //             country: {
  //               type: 'string',
  //               description: 'Get the country where the user come from',
  //             },
  //           },
  //           required: ['country'],
  //         },
  //       },
  //     },
  //   ],
  // }

  // const response = await axios.request({
  //   method: 'post',
  //   url: 'https://brain-api.softlaw.ai/v1/chat/completions',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: token,
  //     spaceId: process.env.BRAIN_SPACE_ID,
  //   },
  //   data: data,
  //   responseType: 'json',
  // })

  const response = await axios.request({
    method: 'POST',
    url: 'https://brain-api.softlaw.ai/v1/chat/completions',
    headers: {
      Authorization: 'PoP eyJhbGciOiJSUzI1NiIsImtpZCI6IjlzUTBGeER3WVAydkkwamlZVGp0Y3JpXzYtMm1ndXFZYVBON3d2U1d4V1EiLCJ0eXAiOiJwb3AifQ.eyJjbmYiOnsiandrIjp7ImUiOiJBUUFCIiwia3R5IjoiUlNBIiwibiI6InV5RmlXNlMtcUFNLXhMc3laUFY5WVlybzRPZ0dBUXlUQUYwc2pCZXJQSnNnMzhPZmtvU0oyY0NCT2lJdWw3NTdiRDZJM0hmdzJtQVNBQmFvdmFoSy0wMHNvdHJpcWtvbEl4VFAweDE1a2ZCVW91ODJydzBNSmhkTHl4Rks3SElPYnNHd1dRNWx4dTdSZlNrR0ZqbHJMSW1BWndrUjdlX3dvdUpEMWFMem1mSXRlLXRCUFEwc3pmNUtwLV90cnlLLTRIS3NxWHJXZS1pWU9ZZzY0VGZ5S2pRVmxrbml3T0NzdXhTMURYUEQxZ0tTZDVZZlRlcl9DdFE5ek5LQWp4UVEzamtzSjBmZlIzVGlDVDFaOWtzOF83OWJiOTdJa1NwUDBkWjFXcTJtQnBVdU5qTC1uX0JRTGpON1kwU2NOdlFBN0lzRUoxR0tHV1RuWGJxUnVEdzRoUSJ9fSwidHMiOjE3NDg5MjMxNTgsImF0IjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKU1V6STFOaUlzSW5nMWRDSTZJa05PZGpCUFNUTlNkM0ZzU0VaRlZtNWhiMDFCYzJoRFNESllSU0lzSW10cFpDSTZJa05PZGpCUFNUTlNkM0ZzU0VaRlZtNWhiMDFCYzJoRFNESllSU0o5LmV5SmhkV1FpT2lKaGNHazZMeTgxT0dRd016RmpOeTAwTmpJekxUUXdaamt0WVRCaFppMDVaREl3TUdObU1UUm1NMllpTENKcGMzTWlPaUpvZEhSd2N6b3ZMM04wY3k1M2FXNWtiM2R6TG01bGRDODVZMlZrTkRFd09TMDROek01TFRReU9UVXRPR1F6WmkxaE1Ua3pOekZoWVdVeU5qTXZJaXdpYVdGMElqb3hOelE0T1RJeU9EVTRMQ0p1WW1ZaU9qRTNORGc1TWpJNE5UZ3NJbVY0Y0NJNk1UYzBPRGt5TmpjMU9Dd2lZV2x2SWpvaWF6SlNaMWxHUTNaaWJHMHhPVFJpZGpkYWJuQnpLMk52UzFNclpFTjNRVDBpTENKaGNIQnBaQ0k2SWpNNFpEVm1Zekl4TFRreFpHVXROREJsWVMwNE1tUXdMV000TVRkalpXRTRNelpsTlNJc0ltRndjR2xrWVdOeUlqb2lNU0lzSW1OdVppSTZleUpyYVdRaU9pSTVjMUV3Um5oRWQxbFFNblpKTUdwcFdWUnFkR055YVY4MkxUSnRaM1Z4V1dGUVRqZDNkbE5YZUZkUklpd2llRzF6WDJ0emJDSTZiblZzYkgwc0ltbGtjQ0k2SW1oMGRIQnpPaTh2YzNSekxuZHBibVJ2ZDNNdWJtVjBMemxqWldRME1UQTVMVGczTXprdE5ESTVOUzA0WkRObUxXRXhPVE0zTVdGaFpUSTJNeThpTENKdmFXUWlPaUpqWm1Vd05EbGxPUzB3Tm1NekxUUTJObUV0WVdRMVl5MDJaREUzTTJWa1lUVmtOR1lpTENKeWFDSTZJakV1UVZNNFFVTlZTSFJ1UkcxSWJGVkxUbEEyUjFSallYSnBXVGhqZURCR1oycFNkbXhCYjBzdFpFbEJlbmhVZWw5c1FVRkJka0ZCTGlPa0luSnZiR1Z6SWpwYklrUnZZM1Z0Wlc1MExsZHlhWFJsSWl3aVEyeHBaVzUwTGxkeWFYUmxJbDBzSW5OMVlpSTZJbU5tWlRBME9XVTVMVEEyWXpNdE5EWTJZUzFoWkRWakxUWmtNVGN6WldSaE5XUTBaaUlzSW5SbGJtRnVkRjl5WldkcGIyNWZjMk52Y0dVaU9pSkZWU0lzSW5ScFpDSTZJamxqWldRME1UQTVMVGczTXprdE5ESTVOUzA0WkRObUxXRXhPVE0zTVdGaFpUSTJNeUlzSW5WMGFTSTZJazl6Wm04MVFtcGlja1T6Y0V0T2VXVTVlVGxEUVVFaUxDSjJaWElpT2lJeExqQWlMQ0o0YlhOZlpuUmtJam9pWlVoRGJ6RlRhMjlNVFU5cVVrbGFaRjk2V1hSb1ducFZhamRoUmxkSmN6bHJYMjh3ZGtrek0yTlRkMEphV0ZaNVlqTkNiR0p0T1hsa1IyZDBXa2hPZEdOM0luMC5OendlTnZ1bzVETmQtUXMxMjViVVZWUk9fMGpXaHU3T0Rpd2tCaUZuRjkyT25nN3kzaWJrOTNWWkQ1aUtkaDN1Z25MWGhDNTNoOHZaR01QY290T05ITXFzY0QtdlhMS0NCOTFvQW1fM1IwRk80ZjVSbm5FbG0wSDdFTm5mdHAxZHdyYktOMGJiSmpaWFc2U0djT1o4aTlZTDk4TG1zS3E5SE9keE4yTU5MMU93YnhheDViOW9FWnJSNXNNRTA5T0tENnVHdjNzSDhlWVl1dVpuelJ4UjhXUjdrYzFEQW80VnNhSHFnWExCdXRSUF82UmhxbUx0ZFhmeEhtNlZzMWtFbG1wcjVEbDJ2WTJDS1RiRVhvN2lubUw2WlI4M29tcXZiWFZoMVhGbHg4bV9yLXpYN1d3M2VBNkZfWlo0VDcyNVJIUGpMQ1F0bkFYWTVZNmpvLVFZUlEiLCJub25jZSI6IjgyZTRiYTVkOTM0NjQ2MDVhNmNmNWM5Y2ZmOTQzMDk4IiwidSI6ImJyYWluLWFwaS5zb2Z0bGF3LmFpIiwicCI6Ii8ifQ.jfrMtBSJ3eiPNmKFPc1axX49_8JjlbINg_KBSMYLe4wXc2TocVvEFHCrQqakl2ZPsHLqw1tjmvcsMTPU0mgABO_dILuBqVASKgA2Dnek2ps5Rr4DPTDPzSVhZgjQsDwbQq9tSJY5uWFRQzGUloFmx8t37bSEQZfIUnltmAP8tONrtmx0VfZVHZ5MQ5VtYn8AyIJJx9BoFeRFvMkNwgZqlcsD-C8JCgzrjyldDvvMccrkm_pDzdRBwwILPKQi506dwnky3jGPG8qunokWmifRJor6CC9JPlr7xTf5sFUyngYrSh2fL2JncRQ_XQBA2YJnrNk26UiW6lE9YMJdfW7JVg.c5h697wK6+mU4TvThrK66XYeYJWd9GtygpWGLLJRA7F+rLUjDIgypkWLcDtkMtyMxk/80ER8vKHwpjv+PN48/v6Q6t3a6scpuEnWaM4nYEgbgQhY0DTMtdwdKcLdD2VC',
      spaceId: 'c9718310-395d-4db1-bfc8-54dd021ea686'
    },
    data: {
      model: 'phi-4',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant from Brain of Septeo.'
        },
        { role: 'user', content: 'who are you?' }
      ]
    },
    responseType: 'json'
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
