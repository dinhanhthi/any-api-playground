import ogs from 'open-graph-scraper'

ogs({ url: 'https://math2it.com' }).then(res => {
  console.log(res.result)
})