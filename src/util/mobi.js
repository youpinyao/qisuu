const periodical = require('kindle-periodical-cn');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// mobi({
//   title: '《修真聊天群》全集',
//   author: '圣骑士的传说',
// }, path.resolve(__dirname, '../../download/《修真聊天群》全集-圣骑士的传说'))

async function mobi(detail, input) {

  return new Promise(async (resolve) => {
    console.log(chalk.green('generate mobi start'));

    const articles = fs.readdirSync(input).filter(item => /\.txt/g.test(item)).sort((afile, bfile) => parseInt(afile.split('-')[0]) - parseInt(bfile.split('-')[0])).map(file => ({
      title: file.split('.txt')[0],
      author: detail.author,
      content: fs.readFileSync(path.resolve(input, file)).toString().replace(/\n/g, '<br />'),
      // file: path.resolve(input, file),
      // url: path-to-local-file,
    }));

    const sections = [];
    const split = 100;
    let cover = undefined;

    if (detail.cover) {
      cover = path.resolve(input, `cover.${detail.cover.split('.')[detail.cover.split('.').length - 1]}`);
    }

    articles.forEach((article, i) => {
      if (i % split === 0) {
        sections.push({
          title: `${i + 1} - ${i + 1 + split}`,
          articles: [],
        });
      }
      sections[sections.length - 1].articles.push(article);
    });


    const bookData = {
      title: detail.title,
      creator: detail.author,
      publisher: detail.author,
      subject: `作者：${detail.author} 时间：${detail.date} 大小：${detail.size}`,
      language: 'language (en-Gb, de-De, zh-Cn)',
      cover,
      description: `作者：${detail.author} 时间：${detail.date} 大小：${detail.size}`,
      sections,
    };


    await periodical.create(bookData, {
      targetFolder: path.resolve(input), // where should the mobi file go
      compression: 1,
    });
    resolve();

    console.log(chalk.green('generate mobi completed'));
  })
}

module.exports = mobi;
