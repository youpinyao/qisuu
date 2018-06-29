const path = require('path');
const fs = require('fs');

const mail = require('../../src/util/mail');

module.exports = (req, res) => {
  let str = '';

  req.on('data', chunk => {
    str += chunk;
  });
  req.on('end', () => {
    const json = JSON.parse(str);
    const download_url = path.resolve(__dirname, '../../download', `${json.title}-${json.author}/${json.title}.mobi`);

    if (fs.existsSync(download_url)) {
      mail.sendTo({
        ...json,
        download_url,
      }).then(() => {
        res.send('[]');
      }, (data) => {
        res.status(400).send(JSON.stringify({
          message: JSON.stringify(data),
        }));
      });
    } else {
      res.status(400).send(JSON.stringify({
        message: 'mobi文件不存在'
      }));
    }
  });
}
