var express = require('express');
var fs = require('fs');


var dataDir = __dirname + "/fixtures";

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});



app.get('/', function(req, res){
  res.render('index', {
    title: 'Express',
    items: ['Item A', 'Item B']
  });
});

app.get('/data/user/:id', function(req, res) {
  var userId = req.params.id;
  var fpath = dataDir + "/users/" + userId + "/data.json"
  fs.readFile(fpath, "utf-8", function (err, data) {
    res.send(data);
  });
});


app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

