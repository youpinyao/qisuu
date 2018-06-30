// const fs = require('fs');
const template = require('art-template');

const config = require('../config');
const file = require('../util/file');
const rssTemplate = `
<?xml version="1.0" encoding="ISO-8859-1" ?>
<rss version="2.0">
  {{each list}}
  <channel>
    <title>{{$value.title}}</title>
    <link>{{$value.page_url}}</link>
    <description>{{$value.author}} {{$value.size}} {{$value.date}}</description>
  </channel>
  {{/each}}
</rss>
`;

module.exports = async function() {
  const data = JSON.parse(await file.read(config.listPath));

  file.write(config.rssPath, template.render(rssTemplate, {
    list: data,
  }));
}
