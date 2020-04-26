const cheerio = require('cheerio');
const queryString = require('query-string');
const chalk = require('chalk');
const path = require('path');

const request = require('../../util/request');
const config = require('../../config');
const getDetail = require('./page-content-detail');
const clear = require('./clear');
const chaptersDownload = require('../../action/download');
const download = require('../../util/download');
const mobi = require('../../util/mobi');

const mail = require('../../util/mail');

const List = require('prompt-list');
const Input = require('prompt-input');

const params = {
  searchkey: '',
}

// eslint-disable-next-line
module.exports = async function (searchKey) {
  if (!searchKey) {
    console.log();
    console.log(chalk.red('请输入搜索关键字'));
    console.log();
    return;
  }

  clear();

  params.searchkey = searchKey;

  let html = null;
  let $ = null;
  const data = [];

  html = await request(`${config.searchUrl}?${queryString.stringify(params)}`);
  $ = cheerio.load(html);

  Array.prototype.map.call($('#checkform table tr td:nth-child(2) a'), item => ({
    text: $(item).text(),
    author: $(item).parent().next().text(),
    page_url: `${config.origin}${$(item).attr('href')}`,
    date: +new Date(),
  })).forEach(item => data.push(item));

  if (!data.length) {
    console.log(`${config.searchUrl}?${queryString.stringify(params)}`, chalk.red('搜索结果为空'));
    return;
  }
  const choices = data.map(item => `${item.text} - ${item.author}`);

  const list = new List({
    name: '选择',
    message: '选择其中一个下载',
    // choices may be defined as an array or a function that returns an array
    choices,
  });

  const answer = await list.run();

  const detail = await getDetail(data.filter(item => `${item.text} - ${item.author}` === answer)[0]);

  const downloadMethodChoices = [
    '下载到本地（txt）',
    '下载到本地（分章节）',
    '发送到kindle'
  ];
  const downloadMethodList = new List({
    name: '选择',
    message: '选择其中一个下载方式',
    // choices may be defined as an array or a function that returns an array
    choices: downloadMethodChoices,
  });

  const downloadMethodAnswer = await downloadMethodList.run();

  let input = null;

  if (/kindle/g.test(downloadMethodAnswer)) {
    input = new Input({
      name: 'kindle',
      message: '请输入kindle邮箱地址'
    });
    execKindleAsk();
  } else {
    input = new Input({
      name: '下载目标路径',
      message: '请输入下载目标路径（默认当前cwd目录）'
    });

    input.ask(function (answers) {
      if (/章节/g.test(downloadMethodAnswer)) {
        console.log('detail', detail);
        
        chaptersDownload([detail], path.resolve(process.cwd(), answers || '')).then(() => {
          mobi(detail, path.resolve(process.cwd(), answers || '', `${detail.title}-${detail.author}`))
        });
      } else {
        download(detail, path.resolve(process.cwd(), answers || ''))
      }
    });
  }

  function execKindleAsk() {
    input.ask(function (answers) {
      const params = {
        ...detail,
        chapters: undefined,
        mail: answers,
        convert: true,
      };
      if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(params.mail)) {
        console.log(chalk.red('请输入正确邮箱地址'));
        execKindleAsk();
        return;
      }
      mail.sendTo(params).then(() => {
        console.log(`发送成功 ${answer} ${JSON.stringify(params)}`);
      }, () => {
        console.log(`发送失败 ${answer}  ${JSON.stringify(params)}`);
      });
    });
  }
}
