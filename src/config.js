const path = require('path');

module.exports = {
  origin: 'https://www.qisuu.la',
  pagesUrl: 'https://www.qisuu.la/s/new/',
  searchUrl: 'http://zhannei.baidu.com/cse/site/',
  listPath: path.resolve(__dirname, '../json/list.json'),
  rssPath: path.resolve(__dirname, '../json/rss.xml'),
  jsonPath:  path.resolve(__dirname, '../json'),
  downloadPath: path.resolve(__dirname, '../download'),
  downloadingPath: path.resolve(__dirname, '../downloading'),
  failPath: path.resolve(__dirname, '../fail'),
  cachePath: path.resolve(__dirname, '../cache'),
  dateCachePath: path.resolve(__dirname, '../json/data-cache.json'),
}
