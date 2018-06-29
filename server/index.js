const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
// const fs = require('fs');
const path = require('path');
const app = express();

app.use(logger());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.engine('art', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
});

app.use('/assets', express.static(path.resolve(__dirname, '../views/antd/dist')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
});

app.get('/', function (req, res) {
  res.render('index.art');
});
app.get('/list', require('./get/list.js'));
app.post('/push/to/kindle/txt', require('./post/push-to-kindle-txt.js'));
app.post('/push/to/kindle/mobi', require('./post/push-to-kindle-mobi.js'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('qisuu listening at http://%s:%s', host, port);
});
