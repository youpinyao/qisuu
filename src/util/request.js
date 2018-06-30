const request = require('request-promise')
const fs = require('fs')
const chalk = require('chalk')

const {
  failPath,
  cachePath: cache,
} = require('../config');

module.exports = function (...args) {
  return doRequest(10, null, ...args)
}

function doRequest(retry, oldResolve, ...args) {
  const date = args[1];
  let cachePath = `${cache}/${args[0].replace(/\//g, '$')}`;

  if (date) {
    cachePath += +(new Date(date));
  }

  return new Promise((resolve) => {
    fs.exists(cachePath, exists => {
      if (exists) {
        fs.readFile(cachePath, (err, data) => {
          resolve(data);
          console.log(chalk.green('from cache', args[0]));
        })
        return
      }
      request(...args).then((res) => {
        resolve(res)
        oldResolve && oldResolve(res);
        fs.writeFile(cachePath, res, () => console.log(chalk.yellow(`cached ${args[0]}`)));
      }, (res) => {
        if (retry) {
          console.log('====================================')
          console.log(chalk.red(`retry ${retry} request fail ${args[0]}`))
          console.log('====================================')
          return doRequest(--retry, oldResolve || resolve, ...args)
        } else {
          fs.writeFile(`${failPath}/${args[0].replace(/\//g, '$')}`, res, () => console.log(chalk.red(`fail ${args[0]}`)));
          resolve('')
          oldResolve && oldResolve('');
        }
      })
    })
  });
}
