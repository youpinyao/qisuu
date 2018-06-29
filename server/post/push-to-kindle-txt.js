const mail = require('../../src/util/mail');

module.exports = (req, res) => {
  let str = '';

  req.on('data', chunk => {
    str += chunk;
  });
  req.on('end', () => {
    mail.sendTo({
      ...JSON.parse(str),
      convert: true,
    }).then(() => {
      res.send('[]');
    }, (data) => {
      res.status(400).send(JSON.stringify({
        message: JSON.stringify(data),
      }));
    });
  });
}
