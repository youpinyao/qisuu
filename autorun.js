const spawn = require('cross-spawn');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');

// 检查文件夹
require('./src/util/check-dir');

const {
  dateCachePath,
  // foreverLogPath,
  // outLogPath,
  // errLogPath,
} = require('./src/config');

const format = 'YYYY-MM-DD';

const options = {
  stdio: 'inherit',
};

let dataCache = null;
let isRuning = false;

async function run() {
  isRuning = true;

  spawn.sync('npm', ['run', 'clear-cache'], options);
  spawn.sync('npm', ['run', 'pick'], options);
  spawn.sync('npm', ['run', 'download'], options);
  spawn.sync('npm', ['run', 'serve:stop'], options);
  spawn.sync('npm', ['run', 'serve'], options);

  // if (fs.existsSync(foreverLogPath)) {
  //   fs.unlinkSync(foreverLogPath);
  //   fs.writeFileSync(foreverLogPath, '');
  // }
  // if (fs.existsSync(outLogPath)) {
  //   fs.unlinkSync(outLogPath);
  //   fs.writeFileSync(outLogPath, '');
  // }
  // if (fs.existsSync(errLogPath)) {
  //   fs.unlinkSync(errLogPath);
  //   fs.writeFileSync(errLogPath, '');
  // }

  isRuning = false;
}

async function check() {
  const currentDate = moment().format(format);

  if (dataCache !== currentDate && !isRuning) {
    dataCache = currentDate;
    fs.writeFileSync(dateCachePath, dataCache);
    run();
  } else {
    console.log(chalk.yellow(`dataCache ${dataCache} | currentDate ${currentDate}`));
  }
}

check();
setInterval(check, 1000 * 60);
