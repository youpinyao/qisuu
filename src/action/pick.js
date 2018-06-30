
const file = require('../util/file');
const getPage = require('../util/page')
const getContent = require('../util/content');

const {
  listPath,
} = require('../config');

module.exports = async function() {
  const pages = await getPage()
  let contents = []

  for (let page of pages) {
    const content = await getContent(page)
    contents = contents.concat(content)
  }

  await file.write(listPath, JSON.stringify(contents))

  console.log('====================================')
  console.log('pick completed')
  console.log('====================================')
}
