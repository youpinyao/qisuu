const cheerio = require('cheerio');

module.exports = async function(html) {
  const $ = cheerio.load(html);
  const title = $('.txt_cont > h1').text().trim().replace(/\//g, '|');
  const content = $('#content1').text();

  return {
    title,
    content,
  };
}
