const fs = require('fs');

module.exports = {
  read(path) {
    return new Promise((resolve, reject) => {
      let chunks = '';
      let fd = null;
      const readable = fs.createReadStream(path, {
        autoClose: true,
      });
      readable.on('open',function(_fd) {
        fd = _fd;
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
    return new Promise((resolve, reject) => {
      const wstream = fs.createWriteStream(path, {
        autoClose: true,
      });
      let fd = null;

      wstream.on('open', (_fd) => {
        fd = _fd;
        wstream.write(content);
        wstream.end();
      });
      wstream.on('error', reject);
      wstream.on('finish', () => {
        resolve();
        try {
          fs.close(fd);
        } catch (error) {
          console.log('fs.close', error);
        }
      });
    });
  }
}
