const convert = require('ebook-convert')
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

epub({
  title: '《修真聊天群》全集',
  author: '圣骑士的传说',
}, path.resolve(__dirname, '../../download/《修真聊天群》全集-圣骑士的传说'))

async function epub(detail, input) {

  return new Promise(async (resolve, reject) => {

    await generateHtml(detail, input);

    console.log(chalk.green('generate epub start'));

    // see more options at https://manual.calibre-ebook.com/generated/en/ebook-convert.html
    const options = {
      input: path.resolve(input, `${detail.title}-${detail.author}.html`),
      output: path.resolve(input, `${detail.title}-${detail.author}.epub`),
      authors: detail.author,
      pageBreaksBefore: '//h:h1',
      chapter: '//h:h1',
      insertBlankLine: true,
      insertBlankLineSize: '1',
      lineHeight: '12',
      marginTop: '50',
      marginRight: '50',
      marginBottom: '50',
      marginLeft: '50'
    }

    /*
     * create epub file
     */
    convert(options, function (err) {
      if (err) {
        console.log(chalk.red(err))
        reject(err);
      } else {
        console.log(chalk.green('generate epub completed'));
        resolve(err);
      }
    })
  })
}
async function generateHtml(detail, input) {
  console.log(chalk.green('generate html start'));
  return new Promise(async (resolve) => {
    const files = fs.readdirSync(input);
    const stream = fs.createWriteStream(path.resolve(input, `${detail.title}-${detail.author}.html`));

    for (let file of files) {
      if (/\.txt$/g.test(file)) {
        const txt = fs.readFileSync(path.resolve(input, file)).toString().split('\n');

        await write(stream, `
          <h1>${txt[0]}</h1>
          <p>${txt.splice(1, txt.length).join('\n')}</p>
        `);
      }
    }

    resolve();
    console.log(chalk.green('generate html completed'));
  });
}

async function write(stream, chunk) {
  return new Promise((resolve) => {
    stream.write(chunk, (res) => resolve(res));
  });
}

module.exports = epub;
