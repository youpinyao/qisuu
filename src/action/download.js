
const fs = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');
const path = require('path');
const request = require('../util/request');

const {
  listPath,
  downloadPath,
} = require('../config');

module.exports = async function(singleContent, singleDownloadPath) {
  if (!singleContent && !fs.existsSync(listPath)) {
    console.log('====================================')
    console.log(chalk.red('请先抓取列表 npm run pick'))
    console.log('====================================')
    return
  }

  const contents = singleContent || JSON.parse(fs.readFileSync(listPath))
  for (let content of contents) {
    const novelPath = path.resolve(singleDownloadPath || downloadPath, `${content.title}-${content.author}`);

    content.chapters = content.chapters.map((c, i) => [c, i]);

    if (!fs.existsSync(novelPath)) {
      fs.mkdirSync(novelPath);
    }

    // 封面图
    if (content.cover) {
      request(content.cover).pipe(path.resolve(novelPath, `cover.${content.cover.split('.')[content.cover.split('.').length - 1]}`));
    }

    for(let [chapter, index] of content.chapters) {
      const html = await request(chapter);
      const $ = cheerio.load(html);
      const chapterTitle = $('.txt_cont > h1').text().trim().replace(/\//g, '|');
      const chapterPath = path.resolve(novelPath, `${index + 1}-${chapterTitle}.txt`);
      const chapterContent = $('#content1').text();

      // eslint-disable-next-line
      fs.writeFileSync(chapterPath, `${chapterTitle} \n ${chapterContent.replace(/ /g, '').replace(/\n\n/g, '\n')}`);
      console.log(chalk.green(`download ${chapterPath} completed`));
    }
  }
  console.log('====================================')
  console.log('all downloads completed')
  console.log('====================================')
}
