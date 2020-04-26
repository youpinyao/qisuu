const {
  search,
} = require('../parser');

module.exports = async function (searchKey) {
  await search(searchKey);
}
