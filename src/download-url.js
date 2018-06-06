const config = require('../config');
const request = require('./request');
const cheerio = require('cheerio')

const sleep = require('./sleep');

module.exports = async function(url) {
  console.log('====================================');
  console.log('geting download_url', url);
  // console.log('====================================');

  const html = await request(url);
  const $ = cheerio.load(html);
  const download_url = $('.showDown script').html().split('\',\'')[1];

  // console.log('====================================');
  console.log('get download url completed', download_url);
  console.log('====================================');

  return new Promise((resolve, reject) => {
    resolve(download_url);
  });
}
