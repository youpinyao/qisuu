const config = require('../config')
const chalk = require('chalk')
const request = require('./request')
const cheerio = require('cheerio')

const sleep = require('./sleep')
const getDetail = require('./detail')

let oldContentsJson = null

module.exports = async function (page, oldContents) {
  console.log('====================================')
  console.log('geting contents', page)
  console.log('====================================')

  if (!oldContentsJson) {
    oldContentsJson = {}
    oldContents.forEach(item => {
      oldContentsJson[`${item.date}-${item.title}`] = item
    })
  }

  const html = await request(page)
  const $ = cheerio.load(html)
  const contents = []
  const downloads = []

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
    const oldContent = oldContentsJson[`${content.date}-${content.title}`]

    if (!oldContent) {
      contents.push(content)
    } else {
      console.log(chalk.yellow(`已存在 ${content.date}-${content.title}`))
    }
  })

  for(let content of contents) {
    const detail = await getDetail(content.page_url)
    await sleep()
    downloads.push(detail.download_url)
  }

  contents.forEach((content, index) => {
    const filename = downloads[index].split('/')
    content.download_url = downloads[index]
    content.filename = filename[filename.length - 1]
  })

  console.log('====================================')
  console.log('get contents completed')
  console.log('====================================')

  return new Promise((resolve) => {
    resolve(contents)
  })
}
