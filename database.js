var fs = require('fs');


this.init = function (dataDir) {
  var db = new DB();
  var usersDir = dataDir + "/users/";
  loadData(usersDir, function (data) {
    db.addUser(data);
  });
  return db;
};


function loadData(dir, callback) {
  fs.readdirSync(dir).forEach(function (fname) {
    var dpath = dir + fname;
    if (fs.statSync(dpath).isDirectory()) {
      var fpath = dpath + "/data.json";
      console.log("Loading data from: " + fpath);
      callback(loadJSON(fpath));
    }
  });
}

var loadJSON = this.loadJSON = function (fpath) {
  var str = fs.readFileSync(fpath, "utf-8");
  return JSON.parse(str);
}


function DB() {
  this.users = {};
  this.categories = {};
}
DB.prototype = {
  addUser: function (data) {
    console.log("Add user: " + data.id);
    this.users[data.id] = data;
  }
};

