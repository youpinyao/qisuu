const fs = require('fs');
const doClearRepeat = require('./clear-repeat');

const {
  downloadPath,
} = require('../config');

module.exports = async function() {
  let oldContents = fs.readdirSync(downloadPath);

  oldContents = oldContents.map(item => {
    const arr = item.split('-')
    return {
      title: [].concat(arr).splice(3, arr.length - 3).join('-'),
      filename: [].concat(arr).splice(3, arr.length - 3).join('-'),
      date: arr.splice(0, 3).join('-'),
    }
  })

  doClearRepeat(oldContents);
}
