const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/comments';

const db = mongoose.connect(mongoUri);

module.exports = db;
