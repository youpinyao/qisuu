const config = require('../config')
// eslint-disable-next-line
const chalk = require('chalk')
const request = require('./request')
const cheerio = require('cheerio')

const getDetail = require('./detail')
const sleep = require('../util/sleep');

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

    const page_url = $(this).find('a').eq(0).attr('href');

    const content = {
      title: `${$(this).find('a').eq(0).text()}`,
      author: desc[0],
      size: desc[1],
      date: desc[2],
      page_url: page_url ? `${config.origin}${page_url}` : undefined,
      download_url: '',
      filename: '',
    }
    content.page_url ? contents.push(content) : console.log(chalk.red(`page_url is empty ${JSON.stringify(content)}`))
  })

  for(let content of contents) {
    const detail = await getDetail(content)
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
  console.log('====================================');

  await sleep();

  return new Promise((resolve) => {
    resolve(contents)
  })
}
