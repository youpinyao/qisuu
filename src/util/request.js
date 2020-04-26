const request = require('request-promise')
const fs = require('fs')
const chalk = require('chalk')
const file = require('../util/file');

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
    fs.exists(cachePath, async (exists) => {
      if (exists) {
        resolve(await file.read(cachePath));
        console.log(chalk.yellow('from cache', args[0]))
        return
      }
      request(args[0], {
        gzip: true,
      }, function (err, resp, body) {
        if (err) {
          if (retry) {
            console.log('====================================')
            console.log(chalk.red(`retry ${retry} request fail ${args[0]}`))
            console.log('====================================')
            return doRequest(--retry, oldResolve || resolve, ...args)
          } else {
            file.write(`${failPath}/${args[0].replace(/\//g, '$')}`, body).then(() => console.log(chalk.red(`fail ${args[0]}`)));
            resolve()
            oldResolve && oldResolve();
          }
        } else {
          resolve(body);
          oldResolve && oldResolve(body);
          file.write(cachePath, body).then(() => { });
          // console.log(chalk.yellow(`cached ${args[0]}`))
        }
      });
    })
  });
}
