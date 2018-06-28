const config = require('../config')
// eslint-disable-next-line
const chalk = require('chalk')
const request = require('./request')
const cheerio = require('cheerio')

const getDetail = require('./detail')

module.exports = async function (page) {
  console.log('====================================')
  console.log('geting contents', page)
  console.log('====================================')

  const html = await request(page)
  const $ = cheerio.load(html)
  let contents = []
  const details = []

  $('.listBox ul li').each(function () {
    const desc = `${$(this).find('.s').text()}`.split('作者：').join('$').split('大小：').join('$').split('等级：').join('$').split('更新：').join('$').split('$').filter(item => !!item)

    const content = {
      title: `${$(this).find('a').eq(0).text()}`,
      author: desc[0],
      size: desc[1],
      date: desc[2],
      page_url: `${config.origin}${$(this).find('a').eq(0).attr('href')}`,
      download_url: '',
      filename: '',
    }
    contents.push(content)
  })

  for(let content of contents) {
    const detail = await getDetail(content.page_url)
    details.push(detail)
  }

  contents = contents.map((content, index) => {
    const detail = details[index];
    const filename = detail.download_url.split('/');

    return {
      ...content,
      ...detail,
      filename: filename[filename.length - 1]
    }
  })

  console.log('====================================')
  console.log('get contents completed')
  console.log('====================================')

  return new Promise((resolve) => {
    resolve(contents)
  })
}
