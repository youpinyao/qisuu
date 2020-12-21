const chalk = require('chalk');
const fs = require('fs');
const Input = require('prompt-input');
const { baseUrlPath, baseUrl } = require('../config');

module.exports = async function () {
  const config = {};
  const input = new Input({
    name: 'baseUrl',
    message: `请输入搜索网址，默认：${baseUrl}`,
  });
  input.ask((answer) => {
    config.baseUrl = answer || baseUrl;
    fs.writeFileSync(baseUrlPath, JSON.stringify(config, undefined, 2));
    console.log(chalk.green('配置成功'));
  });
};
