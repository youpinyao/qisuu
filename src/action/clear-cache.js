const fs = require('fs');

const {
  cachePath,
} = require('../config');

module.exports = async function () {
  if (fs.existsSync(cachePath)) {
    const files = fs.readdirSync(cachePath);

    for(let file of files) {
      fs.unlinkSync(`${cachePath}/${file}`);
    }

    fs.rmdirSync(cachePath);
  }
};
