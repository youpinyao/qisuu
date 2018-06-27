const spawn = require('cross-spawn');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');

// 检查文件夹
require('./src/util/check-dir');

const {
  dateCachePath,
} = require('./src/config');

const format = 'YYYY-MM-DD';

const options = {
  stdio: 'inherit',
};

let dataCache = null;
let isRuning = false;

if (fs.existsSync(dateCachePath)) {
  dataCache = fs.readFileSync(dateCachePath).toString();
}


async function run() {
  isRuning = true;

  // spawn.sync('npm', ['run', 'clear-cache'], options);
  spawn.sync('npm', ['run', 'pick'], options);
  spawn.sync('npm', ['run', 'clear-repeat'], options);
  spawn.sync('npm', ['run', 'download'], options);
  spawn.sync('npm', ['run', 'clear-repeat-force'], options);
  spawn.sync('npm', ['run', 'rss'], options);

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
