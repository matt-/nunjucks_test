var nunjucks = require('nunjucks');
var express = require('express');

var app = express();

var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
e = env.getFilter('escape');
env.addFilter('escape', function(str){
    console.log(str);
})

app.get('/', function(req, res) {
    res.render('index.html', { username: req.query.name });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
