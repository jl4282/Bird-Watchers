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
  console.log('======\n', req.method, req.path);
  console.log('req.body: ', req.body);
  console.log('req.session.minVal: ', req.session.minVal);
  next();
});

var path = require("path");

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.get('/', function(req, res) {
  res.render('home');
});
app.get('/settings', function(req, res) {
  res.render('settings', {minVal: req.session.minVal});
});
app.get('/birds', function(req, res) {
  res.render('birds', {birdsList: filterBirds(req.session.minVal)});
  function filterBirds(minVal){
    if (minVal){ //filter if there's a minVal
      return birdsList.filter(function(bird){
        return bird.count >= minVal;
      });
    }
    else //otherwise return the normal list
      return birdsList;
  }
});
app.post('/birds', function(req, res) {
  // check and add to bird
  var found = false;
  for (var i in birdsList){
    if (req.body.bird.toLowerCase() === birdsList[i].name.toLowerCase()){
      birdsList[i].count++;
      found = true;
    }
  }
  if (!found && req.body.bird.trim()){ //making sure not to add empty birds
    birdsList.push({'name':req.body.bird, 'count': 1});
  }
  res.redirect('/birds');
});
app.post('/settings', function(req, res){
  req.session.minVal = req.body.minVal;
  res.redirect('/birds');
});
//throw 500!

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
