var marked = require('marked');
var fs = require('fs');

var readMe = fs.readFileSync('README.md', 'utf-8');
var markdownReadMe = '<link rel="stylesheet" href="css/main.css">\n'+ marked(readMe);

fs.writeFileSync('README.html', markdownReadMe)