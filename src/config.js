const path = require('path');

module.exports = {
  concurrent: 5,
  parser: 'qisuu',
  origin: 'http://www.xqishuta.com',
  pagesUrl: 'http://www.xqishuta.com/s/new/',
  searchUrl: 'http://www.xqishuta.com/search.html/',
  listPath: path.resolve(__dirname, '../json/list.json'),
  jsonPath:  path.resolve(__dirname, '../json'),
  downloadPath: path.resolve(__dirname, '../download'),
  downloadingPath: path.resolve(__dirname, '../downloading'),
  failPath: path.resolve(__dirname, '../fail'),
  cachePath: path.resolve(__dirname, '../cache'),
  dateCachePath: path.resolve(__dirname, '../json/data-cache.json'),
  foreverLogPath: path.resolve(__dirname, '../forever.log'),
  outLogPath: path.resolve(__dirname, '../out.log'),
  errLogPath: path.resolve(__dirname, '../err.log'),
}
