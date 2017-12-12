var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
    winner: String,
    loser: String,
    currentUser: String,
    otherUser: String,
    verdict: String,
});

module.exports = mongoose.model('Result', ResultSchema);
