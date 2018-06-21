const request = require('request-promise')
const fs = require('fs')
const chalk = require('chalk')

const {
  failPath,
  cachePath: cache,
} = require('../config');

module.exports = function (...args) {
  return doRequest(2, ...args)
}

function doRequest(retry, ...args) {
  const cachePath = `${cache}/${args[0].replace(/\//g, '$')}`
  return new Promise((resolve) => {
    if (fs.existsSync(cachePath)) {
      resolve(fs.readFileSync(cachePath))
      console.log(chalk.yellow('from cache', args[0]))
      return
    }
    request(...args).then((res) => {
      resolve(res)
      fs.writeFileSync(cachePath, res)
    }, (res) => {
      if (retry) {
        console.log('====================================')
        console.log(chalk.red(`retry ${retry} request fail ${args[0]}`))
        console.log('====================================')
        return doRequest(--retry, ...args)
      } else {
        fs.writeFileSync(`${failPath}/${args[0].replace(/\//g, '$')}`, res)
        resolve('')
      }
    })
  })
}
