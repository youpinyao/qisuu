
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('common'));
app.use('/download', express.static('download'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('qisuu listening at http://%s:%s', host, port);
});
