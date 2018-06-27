const spawn = require('cross-spawn');
const fs = require('fs');
const moment = require('moment');

const format = 'YYYY-MM-DD';

const config = require('./src/config');

const options = {
  stdio: 'inherit',
};

let dataCache = null;
let isRuning = false;

if (fs.existsSync(config.dateCachePath)) {
  dataCache = fs.readFileSync(config.dateCachePath).toString();
}

async function run() {
  isRuning = true;

  spawn.sync('npm', ['run', 'clear-cache'], options);
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
    fs.writeFileSync(config.dateCachePath, dataCache);
    run();
  }
}

check();
setInterval(check, 1000 * 60);
