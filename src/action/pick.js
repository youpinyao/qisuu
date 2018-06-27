
const fs = require('fs');
const getPage = require('../util/page')
const getContent = require('../util/content');
const sleep = require('../util/sleep');

const {
  listPath,
} = require('../config');

let oldContents = []

if (fs.existsSync(listPath)) {
  oldContents = JSON.parse(fs.readFileSync(listPath))
}

module.exports = async function() {
  const pages = await getPage()
  let contents = []

  for (let page of [pages[0]]) {
    const content = await getContent(page, oldContents)
    await sleep()
    contents = contents.concat(content)
  }

  fs.writeFileSync(listPath, JSON.stringify(contents.concat(oldContents)))

  console.log('====================================')
  console.log('pick completed')
  console.log('====================================')
}
