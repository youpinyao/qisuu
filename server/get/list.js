module.exports = (req, res) => {
  const list = require('../../json/list.json');
  const {
    searchKey = '',
    current = 1,
    pageSize = 10,
  } = req.query;

  const content = list.filter(item => (new RegExp(searchKey)).test(item.title) || (new RegExp(searchKey)).test(item.author)).splice((current - 1) * pageSize, pageSize).map(item => ({
    ...item,
    chapters: undefined,
  }));

  const data = {
    content,
    total: list.length
  }
  res.send(data);
}
