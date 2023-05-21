/**
 * How to use?
 *
 * node -r dotenv/config notion-api/udPageProperties.js
 */


import { Client } from '@notionhq/client'

async function main() {
  const notionClient = new Client({
    auth: process.env.NOTION_TOKEN,
    notionVersion: process.env.NOTION_VERSION,
  })

  const pageId = '290c603ab66342a49bcc2d04d49be4bd'
  const imgurUrl = 'https://i.imgur.com/jP0t7fc.jpg'
  await updateBookCoverProperty(notionClient, pageId, imgurUrl)
  console.log('🥳 Updated bookCover property')
}

async function updateBookCoverProperty(notionClient, pageId, imgurUrl) {
  const response = await notionClient.pages.update({
    page_id: pageId,
    properties: {
      bookCover: {
        files: [
          {
            name: 'uploaded from script',
            type: 'external',
            external: { url: imgurUrl },
          },
        ],
      },
    },
  })

  return response
}

main()
