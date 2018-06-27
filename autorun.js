const spawn = require('cross-spawn');
const fs = require('fs');
const moment = require('moment');

const format = 'YYYY-MM-DD';

const config = require('./src/config');

let dataCache = moment().format(format);
let isRuning = false;

if (fs.existsSync(config.dateCachePath)) {
  dataCache = fs.readFileSync(config.dateCachePath).toString();
}

async function run() {
  isRuning = true;

  spawn.sync('npm', ['run', 'clear-cache']);
  spawn.sync('npm', ['run', 'pick']);
  spawn.sync('npm', ['run', 'clear-repeat']);
  spawn.sync('npm', ['run', 'download']);
  spawn.sync('npm', ['run', 'clear-repeat-force']);
  spawn.sync('npm', ['run', 'rss']);

  isRuning = false;
}

async function check() {
  const currentDate = moment().format(format);

  if (dataCache !== currentDate && !isRuning) {
    run();
    fs.writeFileSync(config.dateCachePath, currentDate);
  }
}

check();
setInterval(check, 1000 * 60);
