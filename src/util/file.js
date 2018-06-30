const fs = require('fs');

let count = 0;

module.exports = {
  read(path) {
    count ++;
    return new Promise((resolve, reject) => {
      let chunks = '';
      const fd = +(new Date()) + count;
      const readable = fs.createReadStream(path, {
        autoClose: true,
        fd,
      });
      readable.on('data', function (chunk) {
        chunks += chunk;
      });

      readable.on('end', function () {
        resolve(chunks);
        try {
          fs.close(fd);
        } catch (error) {
          console.log('fs.close', error);
        }
      });
      readable.on('error', reject);
    });
  },
  write(path, content) {
    count ++;
    return new Promise((resolve, reject) => {
      const fd = +(new Date()) + count;
      const wstream = fs.createWriteStream(path, {
        autoClose: true,
        fd,
      });

      wstream.on('open', () => {
        wstream.write(content);
        wstream.end();
      });
      wstream.on('error', reject);
      wstream.on('finish', () => {
        fs.close(fd);
        resolve();
      });
    });
  }
}
