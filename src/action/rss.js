const fs = require('fs');
const template = require('art-template');

const config = require('../config');
const rssTemplate = `
<?xml version="1.0" encoding="ISO-8859-1" ?>
<rss version="2.0">
  {{each list}}
  <channel>
    <title>{{$value.title}}</title>
    <link>{{$value.download_url}}</link>
    <description>{{$value.author}} {{$value.size}} {{$value.date}}</description>
  </channel>
  {{/each}}
</rss>
`;

module.exports = function() {
  fs.writeFileSync(config.rssPath, template.render(rssTemplate, {
    list: JSON.parse(fs.readFileSync(config.listPath).toString()),
  }));
}
