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

  const pageId = 'b4fe88cd-0258-458e-93d5-d5915003b339'
  const response = await notion.pages.retrieve({ page_id: pageId })
  console.log('response: ', JSON.stringify(response))
  console.log('🥳 Done!')
}

main()
