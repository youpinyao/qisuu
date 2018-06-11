const fs = require('fs');
const chalk = require('chalk');
const type = process.argv[2];

const download = require('./src/download');
const getPage = require('./src/page');
const getContent = require('./src/content');
const sleep = require('./src/sleep');

const listPath = './json/list.json';

let oldContents = [];

if (fs.existsSync(listPath)) {
  oldContents = JSON.parse(fs.readFileSync(listPath));
}

async function doPick(params) {
  const pages = await getPage();
  let contents = [];

  for (page of pages) {
    const content = await getContent(page, oldContents);
    await sleep();
    contents = contents.concat(content);
  }

  fs.writeFileSync(listPath, JSON.stringify(contents.concat(oldContents)));

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

async function doClearRepeat(params) {
  let newContent = [];
  const keys = {};
  console.log('====================================');
  console.log('clear repeat start', oldContents.length);
  console.log('====================================');

  oldContents.forEach(item => {
    const key = `${item.title}-${item.filename}`;
    const keyItem = keys[key];
    if (!keyItem) {
      keys[key] = item;
    } else if((+new Date(item.date) > (+new Date(keyItem.date)))) {
      console.log(chalk.yellow(`${keyItem.date} to ${item.date} ${keyItem.title}-${keyItem.filename}`));
      keys[key] = item;
    } else {
      console.log(chalk.yellow(`${item.date} to ${keyItem.date} ${keyItem.title}-${keyItem.filename}`));
    }
  });

  newContent = Object.keys(keys).map(key => keys[key]);

  console.log('====================================');
  console.log('clear repeat success', newContent.length);
  console.log('====================================');

  fs.writeFileSync(listPath, JSON.stringify(newContent));

}


if (!fs.existsSync('download')) {
  fs.mkdirSync('download')
}

if (!fs.existsSync('downloading')) {
  fs.mkdirSync('downloading')
}

if (!fs.existsSync('json')) {
  fs.mkdirSync('json')
}

if (!fs.existsSync('fail')) {
  fs.mkdirSync('fail')
}

if (!fs.existsSync('cache')) {
  fs.mkdirSync('cache')
}


if (!type || type === 'pick') {
  doPick();
} else if (type === 'download') {
  doDownload();
} else if (type === 'clear-repeat') {
  doClearRepeat();
}
