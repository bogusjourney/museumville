var sys = require('sys');
var http = require('http');
var express = require('express');
var request = require('request');
var database = require('./database');
var xml2js = require('xml2js');


var config = database.loadJSON(__dirname + "/siteconf.json", "utf-8");
var dataDir = config.dataDir || __dirname + "/fixtures";
var db = database.init(dataDir);
var app = module.exports = express.createServer();
//var nowjs = require('now');
//var everyone = nowjs.initialize(httpServer);

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
  var searchString = req.param('q');
  if (!searchString) {
    res.render('search', { title: 'search'});
    return;
  }
  var searchUri = 'http://api.europeana.eu/api/opensearch.rss?searchTerms=' +
      searchString + '&qf=TYPE:IMAGE&wskey=' + config.europeana.apiKey;
  var clientReq = request({uri: searchUri}, function(error, clientRes, body) {
    if (!error && clientRes.statusCode == 200) {
      var parser = new xml2js.Parser();
      parser.addListener('end', function(result) {
        res.render('search_result', {items: result.channel.item, title: 'search'});
      });
      parser.parseString(body);
    } else {
      console.log('crap');
    }
  });

});

app.get('/:userId', function(req, res) {
  var data = db.users[req.params.userId];
  if (!data) { res.send(404); return; }
  res.render('curator', {
    'title': "MuseumVille - " + data.name,
    'curator': data
  });
});

app.get('/:userId/exhibit/:exhibitId', function(req, res) {
  var curator = db.users[req.params.userId];
  if (!curator) { res.send(404); return; }
  var exhibit = curator.exhibits[parseInt(req.params.exhibitId)];
  if (!exhibit) { res.send(404); return; }
  res.render('exhibit', {
    'title': "MuseumVille - " + curator.name + " - " + exhibit.name,
    'curator': curator,
    'exhibit': exhibit
  });
});

app.post('/:userId/exhibit/:exhibitId', function(req, res) {
  var curator = db.users[req.params.userId];
  if (!curator) { res.send(404); return; }
  var exhibit = curator.exhibits[parseInt(req.params.exhibitId)];
  if (!exhibit) { res.send(404); return; }
  if (req.accepts('json')) {
    db.addItem(exhibit, req.body.url);
    res.send(200);
  }
});

app.listen(config.serverPort);
console.log("Express server listening on port %d", app.address().port);
