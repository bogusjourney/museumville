var fs = require('fs');


exports.init = function (dataDir) {
  var db = new DB();
  loadData(dataDir + "/users/",
           function (data) { db.addUser(data); });
  return db;
};


function DB() {
  this.users = {};
  this.categories = {};
}
DB.prototype = {

  addUser: function (data) {
    console.log("Add user: " + data.id);
    this.users[data.id] = data;
  },

  addItem: function (exhibit, item) {
    exhibit.items.push(this.completeItem(item));
  },

  completeItem: function (item) {
    // TODO: lookup record from subject?
    if (!item.categories)
      item.categories = [];
    if (!item.homepage)
      item.homepage = null;
    return item;
  }

};


function loadData(dir, callback) {
  fs.readdirSync(dir).forEach(function (fname) {
    var dpath = dir + fname;
    if (fs.statSync(dpath).isDirectory()) {
      var fpath = dpath + "/data.json";
      console.log("Loading data from: " + fpath);
      callback(exports.loadJSON(fpath));
    }
  });
}


exports.loadJSON = function (fpath) {
  var str = fs.readFileSync(fpath, "utf-8");
  return JSON.parse(str);
};


exports.toSlugId = function (label) {
  return label.toLowerCase().replace(/\s+/g, '_').replace(/[^A-Za-z0-9]/g, '0');
};


