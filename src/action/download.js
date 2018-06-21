
const fs = require('fs');
const chalk = require('chalk');
const sleep = require('../util/sleep');
const download = require('../util/download');

const {
  listPath,
} = require('../config');

module.exports = async function() {
  if (!fs.existsSync(listPath)) {
    console.log('====================================')
    console.log(chalk.red('请先抓取列表 npm run pick'))
    console.log('====================================')
    return
  }

  const contents = JSON.parse(fs.readFileSync(listPath))
  for (let content of contents) {
    await download(content)
    await sleep()
  }
  console.log('====================================')
  console.log('download completed')
  console.log('====================================')
}
