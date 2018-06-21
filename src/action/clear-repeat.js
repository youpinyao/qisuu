

const fs = require('fs');
const chalk = require('chalk');

const {
  listPath,
  downloadPath,
} = require('../config');

let oldContents = []

if (fs.existsSync(listPath)) {
  oldContents = JSON.parse(fs.readFileSync(listPath))
}


module.exports = async function(_oldContent) {
  if (_oldContent) {
    oldContents = _oldContent;
  }

  let newContent = []
  const keys = {}
  console.log('====================================')
  console.log('clear repeat start', oldContents.length)
  console.log('====================================')

  oldContents.forEach(item => {
    const key = `${item.title}-${item.filename}`
    const keyItem = keys[key]

    if (!keyItem) {
      keys[key] = item
    } else if((+new Date(item.date) > (+new Date(keyItem.date)))) {
      const saveTo = `${downloadPath}/${keyItem.date}-${keyItem.filename}`
      console.log(chalk.yellow(`${keyItem.date} to ${item.date} ${keyItem.title}-${keyItem.filename}`))
      keys[key] = item

      if (fs.existsSync(saveTo)) {
        fs.unlinkSync(saveTo)
        console.log(chalk.yellow(`删除文件 ${saveTo}`))
      }
    } else {
      const saveTo = `${downloadPath}/${item.date}-${item.filename}`
      console.log(chalk.yellow(`${item.date} to ${keyItem.date} ${keyItem.title}-${keyItem.filename}`))

      if (fs.existsSync(saveTo)) {
        fs.unlinkSync(saveTo)
        console.log(chalk.yellow(`删除文件 ${saveTo}`))
      }
    }
  })

  newContent = Object.keys(keys).map(key => keys[key])

  console.log('====================================')
  console.log('clear repeat success', newContent.length)
  console.log('====================================')

  fs.writeFileSync(listPath, JSON.stringify(newContent))

}
