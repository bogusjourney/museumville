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

  addItem: function (exhibit, recordUrl) {
    exhibit.items.push(this.fetchItemData(recordUrl));
  },

  fetchItemData: function (recordUrl) {
    // TODO
    return {
      "subject": recordUrl,
      "label": {"en": null},
      "thumbnail": recordUrl,
      "homepage": null,
      "categories": []
    }
;
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


