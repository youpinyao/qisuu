
const {
  clear,
} = require('../parseres');

module.exports = async function (isAll) {
  await clear(isAll);
};
