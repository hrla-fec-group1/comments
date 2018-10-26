const db  = require('./index.js');
const Comments = require('./comments.js');
const faker = require('faker')


var makeData = function(){
  var arr = []
  for(var i = 0; i < 1000; i++){
    var tmp = {}
    console.log(faker.random.number({min:1, max:101}),faker.random.number({min:1, max:101}))
    var tmpId = faker.random.number({min:1, max:101})
    var tmpContent = faker.lorem.sentence()
    var tmpUser = faker.internet.userName()
    var tmpPicture = faker.internet.avatar()
    var tmpTime = faker.date.recent()
    var tmpPoint = faker.finance.amount(0,5,2);
    tmp.id = tmpId;
    tmp.content = tmpContent
    tmp.user = tmpUser
    tmp.picture = tmpPicture
    tmp.replies = []
    tmp.time = tmpTime
    tmp.pointInSong = tmpPoint
    for(var x = 0; x < 3; x++){
      var newTmp = {}
      var tmpRepContent = faker.lorem.sentence()
      var tmpRepUser = faker.internet.userName()
      var tmpRepPicture = faker.internet.avatar()
      newTmp.pic = tmpRepPicture
      newTmp.userName = tmpRepUser
      newTmp.reply = tmpRepContent
      tmp.replies.push(newTmp)
    }
    arr.push(tmp)
  }
  return arr
}
var data = makeData()
console.log(data)
const insertSampleBlogs = function() {
  Comments.create(data)
    .then(() => db.close());
};
insertSampleBlogs()
