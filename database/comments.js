const mongoose = require('mongoose');
const db = require('./index.js');
mongoose.Promise = global.Promise;

var itemSchema = mongoose.Schema({
  id: Number,
  content: String,
  user: String,
  picture:String,
  replies: Array,
  time : String,
  pointInSong: Number
});

var Comments = mongoose.model('Comments', itemSchema);
module.exports = Comments;
