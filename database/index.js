var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comments');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  id: Number,
  content: String,
  user: String,
  time : { type : Date, default: Date.now },
  pointInSong: Number
});

var Comments = mongoose.model('Comments', itemSchema);

let help = (obj, parsedRepos) => {
  var repoObj = {};
  Favorites.find({name:obj.name}, function(err,dogs){
    if(repos.length === 0){
      console.log('here')
      repoObj.name = obj.name;
      repoObj.img = obj.img;

      var dog = new Favorites(repoObj);

      dog.save(function (err) {
        if (err) {
          console.log(err);
        }
      })
    } else{
      console.log('not important');
    }

  })
}
let save = (obj,callback) => {
  console.log(obj)
  var parsedRepos = obj;
  //let flag = false;
  
  for (var i = 0; i < parsedRepos.length; i++) {
    var newPar = {name:obj.name,img:obj.img}
    console.log(newPar)
    help(newPar);
    }
}


var selectAll = function(callback) {
  Favorites.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};
module.exports.Favorites = Favorites;
module.exports.selectAll = selectAll;
module.exports.save = save;
