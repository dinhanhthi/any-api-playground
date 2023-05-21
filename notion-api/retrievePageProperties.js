/**
 * How to use?
 *
 * node -r dotenv/config notion-api/retrievePageProperties.js
 */

import { Client } from '@notionhq/client'

async function main() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    notionVersion: process.env.NOTION_VERSION,
  })

  const pageId = '0e2b9c0e-8b87-41ca-9f27-ae0f9a2a28f9'
  const response = await notion.pages.retrieve({ page_id: pageId })
  console.log('response: ', JSON.stringify(response))
  console.log('🥳 Done!')
}

main()
