
// eslint-disable-next-line
const chalk = require('chalk')
const cheerio = require('cheerio')

const config = require('../../config')
const request = require('../../util/request')
const sleep = require('../../util/sleep');
const {
  concurrent,
} = require('../../config');

const getDetail = require('./page-content-detail')


module.exports = async function (
  page, 
  detail = false // 是否拉取详情
) {
  console.log('====================================')
  console.log('geting contents', page)
  // console.log('====================================')

  const html = await request(page)
  const $ = cheerio.load(html)
  let contents = []
  let details = [];
  const concurrentContents = [];

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

  if (detail) {
    for (let i = 0; i < contents.length; i++) {
      if (i % concurrent === 0) {
        concurrentContents.push([]);
      }
      concurrentContents[concurrentContents.length - 1].push(contents[i]);
    }

    for (let concurrentContent of concurrentContents) {
      const concurrentDetails = await Promise.all(concurrentContent.map(c => getDetail(c)));

      details = details.concat(concurrentDetails);
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
  }

  // console.log('====================================')
  console.log('get contents completed')
  console.log('====================================');

  await sleep();

  return new Promise((resolve) => {
    resolve(contents)
  })
}
