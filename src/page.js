const config = require('../config');
const fs = require('fs');
const request = require('./request');
const cheerio = require('cheerio');
const chalk = require('chalk');

const sleep = require('./sleep');

module.exports = async function () {
  console.log('====================================');
  console.log('geting pages', config.pages);
  console.log('====================================');

  const html = await request(config.pages);
  const $ = cheerio.load(html);
  const pages = [];

  $('.tspage select option').each(function (index) {
    pages.push(`${config.origin}${$(this).attr('value')}`)
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(pages));

    console.log('====================================');
    console.log('get pages completed');
    console.log('====================================');
  });
}
