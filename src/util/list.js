const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const {
  jsonPath,
  listPath,
} = require('../config.js');
const file = require('./file.js');

module.exports = {
  async generate() {
    const files = fs.readdirSync(jsonPath);
    let contents = [];

    for (let item of files) {
      if (/^list-/g.test(item)) {
        try {
          contents = contents.concat(JSON.parse(await file.read(path.resolve(jsonPath, item))).map(item => ({
            ...item,
            chapters: [],
          })));
        } catch (error) {
          console.log(chalk.red(`error ${JSON.stringify(error)} ${path.resolve(jsonPath, item)}`));
        }
      }
    }
    await file.write(listPath, JSON.stringify(contents.sort((a, b) => parseFloat(+new Date(b.date)) - parseFloat(+new Date(a.date)))));
  },
  async get() {
    const files = fs.readdirSync(jsonPath);
    const contents = [];

    for (let item of files) {
      if (/^list-/g.test(item)) {
        contents.push(path.resolve(jsonPath, item));
      }
    }
    return contents;
  }
}
