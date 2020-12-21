const fs = require('fs');
const path = require('path');

let baseUrl = 'http://www.uidzhx.com';
const baseUrlPath = path.resolve(__dirname, '../', '.config.json')

// 读取配置
if (fs.existsSync(baseUrlPath)) {
  try {
    baseUrl = fs.readFileSync(baseUrlPath).toJSON().baseUrl || baseUrl;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  // 同时下载数
  concurrent: 5,
  parser: 'qisuu',
  origin: baseUrl,
  pagesUrl: `${baseUrl}/s/new/`,
  searchUrl: `${baseUrl}/search.html`,
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
  baseUrlPath,
  baseUrl,
}
