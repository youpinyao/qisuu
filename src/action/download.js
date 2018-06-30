const fs = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');
const nativeRequest = require('request')
const progress = require('request-progress')
const path = require('path');
const request = require('../util/request');
const file = require('../util/file');
// const mobi = require('../util/mobi');

const {
  listPath,
  downloadPath,
} = require('../config');

module.exports = async function (singleContent, singleDownloadPath) {
  if (!singleContent && !fs.existsSync(listPath)) {
    console.log('====================================')
    console.log(chalk.red('请先抓取列表 npm run pick'))
    console.log('====================================')
    return
  }

  const contents = singleContent || JSON.parse(await file.read(listPath))
  for (let content of contents) {
    const novelPath = path.resolve(singleDownloadPath || downloadPath, `${content.title}-${content.author}`);

    content.chapters = content.chapters.map((c, i) => [c, i]);

    if (!fs.existsSync(novelPath)) {
      fs.mkdirSync(novelPath);
    }

    // 封面图
    if (content.cover) {
      console.log('download cover', content.cover);
      await downloadCover(content, novelPath);
    }

    for (let [chapter, index] of content.chapters) {
      const html = await request(chapter);
      const $ = cheerio.load(html);
      const chapterTitle = $('.txt_cont > h1').text().trim().replace(/\//g, '|');
      const chapterPath = path.resolve(novelPath, `${index + 1}-${chapterTitle}.txt`);
      const chapterContent = $('#content1').text();

      // eslint-disable-next-line
      await file.write(chapterPath, `${chapterTitle} \n ${chapterContent}`);
      console.log(chalk.green(`download ${chapterPath} completed`));
    }

    // await mobi(content, novelPath);
  }
  console.log('====================================')
  console.log('all downloads completed')
  console.log('====================================')
}

function downloadCover(content, novelPath) {
  return new Promise((resolve) => {
    progress(nativeRequest(content.cover))
      .on('error', resolve)
      .on('end', resolve)
      .pipe(fs.createWriteStream(path.resolve(novelPath, `cover.${content.cover.split('.')[content.cover.split('.').length - 1]}`)));
  })
}
