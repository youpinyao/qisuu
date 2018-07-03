const {
  search,
} = require('../parseres');

module.exports = async function (searchKey) {
  await search(searchKey);
}
