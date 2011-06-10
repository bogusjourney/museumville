var http = require('http');
var express = require('express');
var fs = require('fs');
var request = require('request');


var config = JSON.parse(fs.readFileSync(__dirname + "/siteconf.json", "utf-8"));
var dataDir = config.dataDir || __dirname + "/fixtures";


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
  var format = req.params.format;
  var doRender = (format === 'json')?
    function (str) { res.send(str); }
  :
    function (str) {
      var data = JSON.parse(str);
      res.render('curator', {
        'title': "MuseumVille - " + data.name,
        'curator': data
      });
    }
  ;
  var fpath = dataDir + "/users/" + userId + "/data.json"
   fs.readFile(fpath, "utf-8", function (err, str) {
     if (err) {
       res.send(err, 404);
     } else {
        doRender(str);
     }
   });
});


app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

