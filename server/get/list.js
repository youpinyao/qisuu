module.exports = (req, res) => {
  const list = require('../../json/list.json');
  const {
    searchKey = '',
    fileSize = 0,
    current = 1,
    pageSize = 10,
  } = req.query;

  const newList = list
    .filter(item => (new RegExp(searchKey)).test(item.title) || (new RegExp(searchKey)).test(item.author))
    .filter(item => parseFloat(item.size) > fileSize);

  const content = newList.splice((current - 1) * pageSize, pageSize).map(item => ({
    ...item,
    chapters: undefined,
  }));

  const data = {
    content,
    total: newList.length
  }
  res.send(data);
}
