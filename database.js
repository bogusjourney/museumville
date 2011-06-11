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

  newEmptyExhibit: function () {
    var empty = this.newEmptyItem();
    return {
      name: "[Name your exhibit]",
      items: [empty, empty, empty, empty, empty]
    }
  },

  newEmptyItem: function () {
    return {
      "subject": "",
      "label": {"en": ""},
      "thumbnail": "/images/exhibit_placeholder.png",
      "homepage": ""
    };
  },

  addItem: function (curator, exhibit, newItem) {
    var newItem = this.completeItem(newItem);
    var items = exhibit.items;
    var added = false;
    for (var i=0, ln=items.length; i < ln; i++) {
      var it = items[i];
      if (!it.subject) {
        items[i] = newItem;
        return;
      }
    }
    items.push(newItem);
    this.persist(curator);
  },

  completeItem: function (item) {
    // TODO: lookup record from subject, save title, better image link, description...
    if (!item.categories)
      item.categories = [];
    if (!item.homepage)
      item.homepage = null;
    return item;
  },

  persist: function (curator) {
    // TODO: save to disk
    console.log(JSON.stringify(curator, null, 2));
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


