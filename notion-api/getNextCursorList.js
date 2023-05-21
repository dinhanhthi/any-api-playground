/**
 * How to use?
 * Change the databaseId & numPostsPerPage to your settings.
 * Create a .env file in the root directory and add the following:
 * - NOTION_TOKEN
 * - NOTION_VERSION
 * Run the following command:
 * node -r dotenv/config notion/getNextCursorList.js
 */
import fetch from 'node-fetch'

const databaseId = process.env.NOTION_DB_POSTS
const numPostsPerPage = 20

async function main() {
  const nextCursorList = []
  let startCursor = undefined
  let data = await getData(startCursor)
  while (data['has_more']) {
    startCursor = data['next_cursor']
    nextCursorList.push(startCursor)
    data = await getData(startCursor)
  }
  console.log(`🍕 The next_cursor list is: ${JSON.stringify(nextCursorList)}`)
}

async function getData(startCursor) {
  const filter = {
    and: [
      {
        property: 'published',
        checkbox: {
          equals: true,
        },
      },
      {
        property: 'sandbox',
        checkbox: {
          equals: true,
        },
      },
    ],
  }

  // /* ###Thi */ console.log('databaseId: ', databaseId);
  // /* ###Thi */ console.log('numPostsPerPage: ', numPostsPerPage);
  // /* ###Thi */ console.log('startCursor: ', startCursor);
  // /* ###Thi */ console.log('filter: ', filter);
  // /* ###Thi */ console.log('process.env.NOTION_TOKEN: ', process.env.NOTION_TOKEN);
  // /* ###Thi */ console.log('process.env.NOTION_VERSION: ', process.env.NOTION_VERSION);

  const data = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': `${process.env.NOTION_VERSION}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      filter,
      start_cursor: startCursor ?? undefined,
      page_size: numPostsPerPage,
    }),
  })

  return data.json()
}

main()
