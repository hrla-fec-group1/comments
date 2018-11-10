const db  = require('./index.js');
const Comments = require('./comments.js');
const faker = require('faker')

function formatDate(date) {
  var diff = new Date() - date; // the difference in milliseconds
  //console.log('diff',diff)
  if (diff < 1000) { // less than 1 second
    return 'right now';
  }

  var sec = Math.floor(diff / 1000); // convert diff to seconds

  if (sec < 60) {
    return sec + ' sec. ago';
  }

  var min = Math.floor(diff / 60000); // convert diff to minutes
  if (min < 60) {
    return min + ' min. ago';
  } else{
    return (Math.floor((Math.random() * (5 - 1)) + 1)) + ' weeks ago'
  }

  // format the date
  // add leading zeroes to single-digit day/month/hours/minutes
  var d = date;
  d = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map(component => component.slice(-2)); // take last 2 digits of every component
  //console.log(new Date())
  // join the components into date
  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}

var makeData = function(){
  var arr = []
  for(var i = 0; i < 1000; i++){
    var tmp = {}
    //console.log(faker.random.number({min:1, max:101}),faker.random.number({min:1, max:101}))
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
    let ms = Date.parse(tmpTime);
    var res = formatDate(tmpTime)
    tmp.time = res
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
//console.log(data)
const insertSampleBlogs = function() {
  Comments.create(data)
    .then(() => db.close());
};
insertSampleBlogs()
