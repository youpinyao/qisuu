const fs = require('fs');

module.exports = {
  read(path) {
    return new Promise((resolve, reject) => {
      let chunks = '';

      const readable = fs.createReadStream(path, {
        autoClose: true,
      });
      readable.on('data', function (chunk) {
        chunks += chunk;
      });

      readable.on('end', function () {
        resolve(chunks);
      });
      readable.on('error', reject);
    });
  },
  write(path, content) {
    return new Promise((resolve, reject) => {
      const wstream = fs.createWriteStream(path, {
        autoClose: true,
      });
      wstream.on('open', () => {
        wstream.write(content, 'utf-8');
        wstream.end();
      });
      wstream.on('error', reject);
      wstream.on('finish', () => {
        resolve();
      });
    });
  }
}
