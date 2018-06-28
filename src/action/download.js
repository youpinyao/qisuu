
const fs = require('fs');
const chalk = require('chalk');
const he = require('he');
const cheerio = require('cheerio');
const path = require('path');
const request = require('../util/request');

const {
  listPath,
  downloadPath,
} = require('../config');

module.exports = async function() {
  if (!fs.existsSync(listPath)) {
    console.log('====================================')
    console.log(chalk.red('请先抓取列表 npm run pick'))
    console.log('====================================')
    return
  }

  const contents = JSON.parse(fs.readFileSync(listPath))
  for (let content of contents) {
    const novelPath = path.resolve(downloadPath, `${content.title}-${content.author}`);

    content.chapters = content.chapters.map((c, i) => [c, i]);

    for(let [chapter, index] of content.chapters) {
      const html = await request(chapter);
      const $ = cheerio.load(html);
      const chapterTitle = $('.txt_cont > h1').text().trim();
      const chapterPath = path.resolve(novelPath, `${index + 1}-${chapterTitle}.txt`);
      const chapterContent = $('#content1').text();

      if (!fs.existsSync(novelPath)) {
        fs.mkdirSync(novelPath);
      }

      // eslint-disable-next-line
      fs.writeFileSync(chapterPath, `${chapterTitle} \n ${chapterContent.replace(/ /g, '').replace(/\n\n/g, '\n')}`);
      console.log(chalk.green(`download ${chapterPath} completed`));
    }
  }
  console.log('====================================')
  console.log('all downloads completed')
  console.log('====================================')
}
