// const fs = require('fs');

const list = require('../util/list');
const file = require('../util/file');
const getPage = require('../util/page')
const getContent = require('../util/content');

const {
  listPath,
} = require('../config');

module.exports = async function () {
  let pages = await getPage();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const content = await getContent(page)
    await file.write(listPath.replace(/\.json/g, `-${i}.json`), JSON.stringify(content));
  }

  list.generate();

  console.log('====================================')
  console.log('pick completed')
  console.log('====================================')
}
