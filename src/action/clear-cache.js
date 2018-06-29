const fs = require('fs');

const {
  cachePath,
} = require('../config');

module.exports = async function (force) {
  if (fs.existsSync(cachePath)) {
    const files = fs.readdirSync(cachePath);

    for(let file of files) {
      if (/\$s\$new\$/g.test(file) || force) {
        fs.unlinkSync(`${cachePath}/${file}`);
      }
    }

    // fs.rmdirSync(cachePath);
  }
};
