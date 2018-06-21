const path = require('path');

module.exports = {
  origin: 'https://www.qisuu.la',
  pagesUrl: 'https://www.qisuu.la/s/new/',
  searchUrl: 'http://zhannei.baidu.com/cse/site/?cc=qisuu.la&s=6107665092019918800&q=',
  listPath: path.resolve(__dirname, '../json/list.json'),
  jsonPath:  path.resolve(__dirname, '../json'),
  downloadPath: path.resolve(__dirname, '../download'),
  downloadingPath: path.resolve(__dirname, '../downloading'),
  failPath: path.resolve(__dirname, '../fail'),
  cachePath: path.resolve(__dirname, '../cache'),
}
