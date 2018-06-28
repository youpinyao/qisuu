const mail = require('../../src/util/mail');

module.exports = (req, res) => {
  let str = '';

  req.on('data', chunk => {
    str += chunk;
  });
  req.on('end', () => {
    mail.sendTo(JSON.parse(str)).then(() => {
      res.send('[]');
    }, (data) => {
      res.send(400, JSON.stringify({
        message: JSON.stringify(data),
      }));
    });
  });
}
