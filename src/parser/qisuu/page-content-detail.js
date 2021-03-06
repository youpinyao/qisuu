
const cheerio = require('cheerio')
const chalk = require('chalk');

const request = require('../../util/request')
const config = require('../../config');
const sleep = require('../../util/sleep');

module.exports = async function (
  content, 
  chapter = false, // 是否拉取章节
) {
  // console.log('====================================')
  // console.log('geting detail', content.page_url)
  // console.log('====================================');

  const html = await request(content.page_url, content.date)
  const $ = cheerio.load(html)

  console.log('get detail request completed', content.page_url)

  const chapter_url = $('.showDown ul li').eq(0).find('.downButton').attr('href');
  const detail = {
    title: ($('.detail_right h1').text() || '').replace(/\//g, '|').trim(),
    author: ($('.detail_right ul li').eq(5).text().split('：')[1] || '').replace(/\//g, '|').trim(),
    cover: `${config.origin}${$('.detail .detail_pic img').attr('src')}`,
    size: ($('.detail_right ul li').eq(1).text().split('：')[1] || '').trim(),
    date: ($('.detail_right ul li').eq(3).text().split('：')[1] || '').trim(),
    page_url: content.page_url,
    chapter_text: ($('.detail_right ul li').eq(7).text() || '').replace(/\//g, '|'),
    chapter: chapter_url ? `${config.origin}${chapter_url}` : undefined,
    chapters: [],
    download_url: $('.showDown script').html(),
    filename: '',
  }

  if (!chapter_url) {
    console.log(chalk.red(`chapter_url is empty ${JSON.stringify(detail)}`));
    console.log(chalk.red(content.page_url));
  }

  // 章节列表
  if (detail.chapter && chapter) {
    const chapterHtml = await request(detail.chapter, detail.date);
    const $c = cheerio.load(chapterHtml);
    const chapters = $c('#info').last().find('.pc_list ul li a');

    detail.chapters = Array.prototype.map.call(chapters, (item) => {
      return `${detail.chapter}${$c(item).attr('href')}`;
    });
  }

  if (detail.download_url) {
    detail.download_url = detail.download_url.split('\',\'')[1];

    const filename = detail.download_url.split('/')
    detail.filename = filename[filename.length - 1]
    detail.filename = detail.filename.replace(/\//g, '|');
  } else {
    detail.download_url = ''
  }

  // console.log('====================================');
  console.log('get detail completed', `${detail.title}-${detail.author}`)
  // console.log('====================================')

  await sleep();

  return new Promise((resolve) => {
    resolve(detail)
  })
}
