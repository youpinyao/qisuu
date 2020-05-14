#!/usr/bin/env node

const commander = require('commander')

const doPick = require('./src/action/pick');
const doDownload = require('./src/action/download');
const doClearCache = require('./src/action/clear-cache');
const doSearch = require('./src/action/search');

// 检查文件夹
require('./src/util/check-dir');

commander
  .version(require('./package.json').version)
  .arguments('<cmd> [params1]')
  .action((cmd, params1) => {
    switch (cmd) {
      case 'pick':
        doPick()
        break
      case 'download':
        doDownload();
        break;
      case 'clear-cache':
        doClearCache();
        break;
      case 'clear-cache-all':
        doClearCache(true);
        break;
      case 'search':
        doSearch(params1);
        break;
    }
  })
  .on('--help', function () {
    console.log('');
    console.log('qisu search <searchKey>');
    console.log('');
  })
  .parse(process.argv)
