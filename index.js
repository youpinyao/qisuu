const fs = require('fs');
const chalk = require('chalk');
const type = process.argv[2];

const download = require('./src/download');
const getPage = require('./src/page');
const getContent = require('./src/content');
const sleep = require('./src/sleep');

const listPath = './json/list.json';

if (!fs.existsSync('download')) {
  fs.mkdirSync('download')
}

if (!fs.existsSync('json')) {
  fs.mkdirSync('json')
}

async function doPick(params) {
  const pages = await getPage();
  let contents = [];

  for (page of [pages[0]]) {
    const content = await getContent(page);
    await sleep();
    contents = contents.concat(content);
  }

  fs.writeFileSync(listPath, JSON.stringify(contents));

  console.log('====================================');
  console.log('pick completed');
  console.log('====================================');
}

async function doDownload() {
  if (!fs.existsSync(listPath)) {
    console.log('====================================');
    console.log(chalk.red('请先抓取列表 npm run pick'));
    console.log('====================================');
    return;
  }

  const contents = JSON.parse(fs.readFileSync(listPath));
  for (content of contents) {
    await download(content);
    await sleep();
  }
  console.log('====================================');
  console.log('download completed');
  console.log('====================================');
}

if (!type || type === 'pick') {
  doPick();
} else if (type === 'download') {
  doDownload();
}
