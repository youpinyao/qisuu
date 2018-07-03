const fs = require('fs');
const chalk = require('chalk');
const cheerio = require('cheerio');
const nativeRequest = require('request')
const progress = require('request-progress')
const path = require('path');
const request = require('../util/request');
const file = require('../util/file');
const list = require('../util/list')
const sleep = require('../util/sleep');
// const mobi = require('../util/mobi');

const {
  concurrent,
  downloadPath,
} = require('../config');

module.exports = async function (specifiedContent, specifiedDownloadPath) {
  const lists = await list.get();
  if (!specifiedContent && !lists.length) {
    console.log('====================================')
    console.log(chalk.red('请先抓取列表 npm run pick'))
    console.log('====================================')
    return
  }

  if (!specifiedContent) {
    for (let list of lists) {
      try {
        const contents = JSON.parse(await file.read(list));
        await doDownload(contents, downloadPath);
      } catch (error) {
        console.log(chalk.red(`error ${JSON.stringify(error)} ${list}`));
      }
    }
  } else {
    await doDownload(specifiedContent, specifiedDownloadPath);
  }

  console.log('====================================')
  console.log('all downloads completed')
  console.log('====================================')
}

async function doDownload(contents, downloadPath) {
  for (let content of contents) {
    const novelPath = path.resolve(downloadPath, `${content.title}-${content.author}`);

    const chapters = content.chapters.map((c, i) => [c, i]);
    const concurrentChapters = [];

    if (!fs.existsSync(novelPath)) {
      fs.mkdirSync(novelPath);
    }

    // 封面图
    if (content.cover) {
      console.log('download cover', content.cover);
      await downloadCover(content, novelPath);
    }

    for (let i = 0; i < chapters.length; i++) {
      if (i % concurrent === 0) {
        concurrentChapters.push([]);
      }
      concurrentChapters[concurrentChapters.length - 1].push(chapters[i]);
    }

    for (let concurrentChapter of concurrentChapters) {
      await Promise.all(concurrentChapter.map(([chapter, index]) => downloadChapter(chapter, index, novelPath)));
    }

    // await mobi(content, novelPath);
  }
}

async function downloadChapter(chapter, index, novelPath) {
  const html = await request(chapter);
  const $ = cheerio.load(html);
  const chapterTitle = $('.txt_cont > h1').text().trim().replace(/\//g, '|');
  const chapterPath = path.resolve(novelPath, `${index + 1}-${chapterTitle}.txt`);
  const chapterContent = $('#content1').text();

  // eslint-disable-next-line
  await file.write(chapterPath, `${chapterTitle} \n ${chapterContent}`);
  console.log(chalk.green(`download ${chapterPath} completed`));

  await sleep();
}

function downloadCover(content, novelPath) {
  return new Promise((resolve) => {
    progress(nativeRequest(content.cover))
      .on('error', resolve)
      .on('end', resolve)
      .pipe(fs.createWriteStream(path.resolve(novelPath, `cover.${content.cover.split('.')[content.cover.split('.').length - 1]}`)));
  })
}
