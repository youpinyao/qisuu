const fs = require('fs');
const download = require('./src/download');

const getPage = require('./src/page');
const getContent = require('./src/content');
const sleep = require('./src/sleep');

if (!fs.existsSync('download')) {
  fs.mkdirSync('download')
}

if (!fs.existsSync('json')) {
  fs.mkdirSync('json')
}

async function init(params) {
  const pages = await getPage();
  let contents = [];

  for(page of pages) {
    const content = await getContent(page);
    await sleep();
    contents = contents.concat(content);
  }

  fs.writeFileSync('./json/list.json', JSON.stringify(contents));

  for(content of contents) {
    await download(content);
    await sleep();
  }
}

init();
