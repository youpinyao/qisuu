const cheerio = require('cheerio');
const queryString = require('query-string');
const chalk = require('chalk');
const path = require('path');

const request = require('../util/request');
const config = require('../config');
const getDetail = require('../util/detail');
const download = require('../util/download');

const List = require('prompt-list');

const params = {
  cc: 'qisuu.la',
  s: '6107665092019918800',
  q: '',
  p: -1,
}

module.exports = async function (searchKey, downloadTo) {
  if (!searchKey) {
    console.log();
    console.log(chalk.red('请输入搜索关键字'));
    console.log();
    return;
  }

  params.q = searchKey;

  let html = null;
  let $ = null;
  let pageSize = 0;
  const data = [];

  while (params.p < pageSize) {
    params.p ++;

    html = await request(`${config.searchUrl}?${queryString.stringify(params)}`);
    $ = cheerio.load(html);
    pageSize = parseInt($('#pageFooter > *').last().prev().find('.pager-normal-foot').text(), 10) || 0;

    if (pageSize < 0) {
      pageSize = 0;
    }

    Array.prototype.map.call($('.content-main .result .c-title a'), item => ({
      text: $(item).text(),
      url: $(item).attr('href'),
    })).filter(item => item.text.endsWith(',txt全集下载,电子书-奇书网')).forEach(item => data.push(item));

    console.log(chalk.yellow(`search page ${params.p + 1}`));

  }

  if (!data.length) {
    console.log(chalk.red('搜索结果为空'));
    return;
  }

  const line = {
    name: '============我是分割线==============',
    disabled: true,
  };
  const choices = data.map(item => item.text);

  choices.push(line);

  const list = new List({
    name: '选择',
    message: '选择其中一个下载',
    // choices may be defined as an array or a function that returns an array
    choices,
  });

  const answer = await list.run();

  const detail = await getDetail(data.filter(item => item.text === answer)[0].url);

  download(detail, path.resolve(process.cwd(), downloadTo || ''))
}
