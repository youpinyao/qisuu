
const request = require('./request')
const cheerio = require('cheerio')

const config = require('../config');

module.exports = async function(content) {
  console.log('====================================')
  console.log('geting detail', content.page_url)
  // console.log('====================================');

  const html = await request(content.page_url, content.date)
  const $ = cheerio.load(html)
  const detail = {
    title: ($('.detail_right h1').text() || '').trim(),
    author: ($('.detail_right ul li').eq(5).text().split('：')[1] || '').trim(),
    size: ($('.detail_right ul li').eq(1).text().split('：')[1] || '').trim(),
    date: ($('.detail_right ul li').eq(3).text().split('：')[1] || '').trim(),
    page_url: content.content,
    chapter: `${config.origin}${$('.detail_right ul li').eq(7).find('a').attr('href')}`,
    chapters: [],
    download_url: $('.showDown script').html(),
    filename: '',
  }

  if (detail.download_url) {
    detail.download_url = detail.download_url.split('\',\'')[1];

    const filename = detail.download_url.split('/')
    detail.filename = filename[filename.length - 1]
  } else {
    detail.download_url = ''
  }

  if (detail.chapter) {
    const chapterHtml = await request(detail.chapter, detail.date);
    const $c = cheerio.load(chapterHtml);
    const chapters = $c('#info').last().find('.pc_list ul li a');

    detail.chapters = Array.prototype.map.call(chapters, (item) => {
      return `${detail.chapter}${$c(item).attr('href')}`;
    });
  }

  // console.log('====================================');
  console.log('get detail completed', `${detail.title}-${detail.author}`)
  console.log('====================================')

  return new Promise((resolve) => {
    resolve(detail)
  })
}
