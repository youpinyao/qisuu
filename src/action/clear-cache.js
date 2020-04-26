
const {
  clear,
} = require('../parser');

module.exports = async function (isAll) {
  await clear(isAll);
};
