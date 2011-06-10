var http = require('http');
var express = require('express');
var request = require('request');
var database = require('./database');


var config = database.loadJSON(__dirname + "/siteconf.json", "utf-8");
var dataDir = config.dataDir || __dirname + "/fixtures";
var db = database.init(dataDir);


var app = module.exports = express.createServer();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


app.get('/', function(req, res){
  res.render('index', {
    title: 'MuseumVille',
    items: ['Item A', 'Item B']
  });
});

app.get('/search', function(req, res) {
  res.render('search', { title: 'search'});
});

app.post('/search', function(req, res) {

  var search_string = req.param('search_string');
  var clientReq = request({uri:'http://api.europeana.eu/api/opensearch.json?searchTerms=' + search_string + '&wskey=' + config.europeana.apiKey}, function(error, clientRes, body) {
    if (!error && clientRes.statusCode == 200) {
      res.render('search_result', { body: body, title: 'search'});
    } else {
      console.log('crap');
    }
  });

});

app.get('/:id.:format?', function(req, res) {
  var userId = req.params.id;
  var data = db.users[userId];
  if (!data) {
    res.send(404);
    return;
  }
  var format = req.params.format;
  var doRender = (format === 'json')?
    function (data) { res.send(JSON.stringify(data)); }
  :
    function (data) {
      res.render('curator', {
        'title': "MuseumVille - " + data.name,
        'curator': data
      });
    }
  ;
  doRender(data);
});

app.listen(config.serverPort);
console.log("Express server listening on port %d", app.address().port);

