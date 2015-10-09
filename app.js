var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({'defaultLayout':'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var sessionOptions = {
  secret: 'secret cookie thang',
  resave: true,
  saveUninitialized: true
};

app.use(session(sessionOptions));

var birdsList = createBirdList();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  console.log(req.method, req.path);
  console.log('======\nreq.body: ', req.body);
  next();
});

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
  res.render('birds', {birdsList: birdsList});
});
app.post('/birds', function(req, res) {
  // check and add to bird
  var found = false;
  for (var i in birdsList){
    if (req.body.bird === birdsList[i].name){
      birdsList[i].count++;
      found = true;
    }
  }
  if (!found){
    birdsList.push({'name':req.body.bird, 'count': 1});
  }
  res.redirect('/birds');
});
//throw 500!
//404 page!
app.use(function(req, res, next) {
  res.status(404).render('404');
});

app.listen(3000);
console.log('Server started on port 3000\n');

function createBirdList(){
  return [
    { name: 'Bald Eagle', count: 3},
    { name: 'Yellow Billed Duck', count: 7 },
    { name: 'Great Cormorant', count: 4}
  ];
}
