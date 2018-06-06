const config = require('../config');
const fs = require('fs');
const chalk = require('chalk');
const request = require('./request');
const cheerio = require('cheerio');

const sleep = require('./sleep');
const getDownloadUrl = require('./download-url');

module.exports = async function (page) {
  console.log('====================================');
  console.log('geting contents', page);
  console.log('====================================');

  const html = await request(page);
  const $ = cheerio.load(html);
  const contents = [];
  const downloads = [];

  $('.listBox ul li').each(function (index) {
    const desc = `${$(this).find('.s').text()}`.split('作者：').join('$').split('大小：').join('$').split('等级：').join('$').split('更新：').join('$').split('$').filter(item => !!item);
    contents.push({
      title: `${$(this).find('a').eq(0).text()}`,
      author: desc[0],
      size: desc[1],
      date: desc[2],
      page_url: `${config.origin}${$(this).find('a').eq(0).attr('href')}`,
      download_url: '',
      filename: '',
    });
  });

  for(content of contents) {
    const url = await getDownloadUrl(content.page_url);
    await sleep();
    downloads.push(url);
  }

  contents.forEach((content, index) => {
    const filename = downloads[index].split('/');
    content.download_url = downloads[index];
    content.filename = filename[filename.length - 1];
  });

  console.log('====================================');
  console.log('get contents completed');
  console.log('====================================');

  return new Promise((resolve, reject) => {
    resolve(contents);
  });
}
