const {
  parser,
} = require('../config');

const page = require(`./${parser}/page`);
const pageContent = require(`./${parser}/page-content`);
const pageContentDetail = require(`./${parser}/page-content-detail`);
const search = require(`./${parser}/search`);
const clear = require(`./${parser}/clear`);
const chapter = require(`./${parser}/chapter`);

module.exports = {
  page,
  pageContent,
  pageContentDetail,
  search,
  clear,
  chapter,
}
