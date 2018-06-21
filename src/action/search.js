const cheerio = require('cheerio');
const chalk = require('chalk');
const path = require('path');

const request = require('../util/request');
const config = require('../config');
const getDetail = require('../util/detail');
const download = require('../util/download');

var List = require('prompt-list');

module.exports = async function (searchKey, downloadTo) {
  if (!searchKey) {
    console.log(chalk.red('请输入搜索关键字'));
    console.log();

    return;
  }

  const html = await request(`${config.searchUrl}${encodeURIComponent(searchKey)}`);
  const $ = cheerio.load(html);

  const data = Array.prototype.map.call($('.content-main .result .c-title a'), item => ({
    text: $(item).text(),
    url: $(item).attr('href'),
  })).filter(item => item.text.endsWith(',txt全集下载,电子书-奇书网'));

  if (!data.length) {
    console.log(chalk.red('搜索结果为空'));
    return;
  }

  const list = new List({
    name: '选择',
    message: '选择其中一个下载',
    // choices may be defined as an array or a function that returns an array
    choices: data.map(item => item.text),
  });

  const answer = await list.run();

  const detail = await getDetail(data.filter(item => item.text === answer)[0].url);

  download(detail, path.resolve(process.cwd(), downloadTo || ''))
}
