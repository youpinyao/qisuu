const fs = require('fs');

const {
  downloadingPath,
  downloadPath,
  jsonPath,
  failPath,
  cachePath,
  listPath,
} = require('../config');

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath)
}

if (!fs.existsSync(downloadingPath)) {
  fs.mkdirSync(downloadingPath)
}

if (!fs.existsSync(jsonPath)) {
  fs.mkdirSync(jsonPath)
}

if (!fs.existsSync(failPath)) {
  fs.mkdirSync(failPath)
}

if (!fs.existsSync(cachePath)) {
  fs.mkdirSync(cachePath)
}
if (!fs.existsSync(listPath)) {
  fs.writeFileSync(listPath, '[]');
}
