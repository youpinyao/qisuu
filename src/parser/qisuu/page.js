
const cheerio = require('cheerio')

const config = require('../../config')
const request = require('../../util/request')

module.exports = async function () {
  console.log('====================================')
  console.log('geting pages', config.pagesUrl)
  // console.log('====================================')

  const html = await request(config.pagesUrl)
  const $ = cheerio.load(html)
  const pages = []

  $('.tspage select option').each(function () {
    pages.push(`${config.origin}${$(this).attr('value')}`)
  })

  return new Promise((resolve) => {
    setTimeout(() => resolve(pages))

    // console.log('====================================')
    console.log('get pages completed')
    console.log('====================================')
  })
}
