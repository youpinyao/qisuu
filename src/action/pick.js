// const fs = require('fs');

const list = require('../util/list');
const file = require('../util/file');
const {
  page: getPage,
  pageContent: getPageContent,
} = require('../parseres');

const {
  listPath,
} = require('../config');

module.exports = async function () {
  let pages = await getPage();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const content = await getPageContent(page);

    console.log('write', JSON.stringify(content).substr(0, 100));
    await file.write(listPath.replace(/\.json/g, `-${i}.json`), JSON.stringify(content));
  }

  list.generate();

  console.log('====================================')
  console.log('pick completed')
  console.log('====================================')
}
