var express = require('express');
var handlebars = require('express-handlebars').create({'defaultLayout':'main'});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var path = require("path");

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.get('/', function(req, res) {
  res.render('home');
});
app.get('/settings', function(req, res) {
  res.render('settings');
});
app.get('/birds', function(req, res) {
  res.render('birds');
});

app.listen(3000);
console.log('Server started on port 3000\n');
