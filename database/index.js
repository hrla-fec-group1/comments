const mongoose = require('mongoose');
const mongoUri = 'mongodb://mongo:27017/comments';

const db = mongoose.connect(mongoUri);

module.exports = db;
