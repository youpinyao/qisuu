const request = require('request-promise');
const fs = require('fs');
const chalk = require('chalk');

module.exports = function (...args) {
  return request(2, ...args);
}

function request(retry, ...args) {
  const cachePath = `./cache/${args[0].replace(/\//g, '$')}`;
  return new Promise((resolve, reject) => {
    if (fs.existsSync(cachePath)) {
      resolve(fs.readFileSync(cachePath));
      console.log(chalk.yellow('from cache', args[0]));
      return;
    }
    request(...args).then((res) => {
      resolve(res);
      fs.writeFileSync(cachePath, res);
    }, (res) => {
      if (retry) {
        return request(retry--, ...args);
      } else {
        fs.writeFileSync(`./fail/${args[0].replace(/\//g, '$')}`, res);
        resolve('');
      }
    });
  });
}
