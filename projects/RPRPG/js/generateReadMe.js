var marked = require('marked');
var fs = require('fs');

var readMe = fs.readFileSync('README.md', 'utf-8');
var markdownReadMe = '<head>\n<link rel="stylesheet" href="../main.css">\n<base target="_blank">\n</head>\n<body id=readmehtml>\n'
+ marked(readMe) +"\n</body>";

fs.writeFileSync('README.html', markdownReadMe)