var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    score: Number,
    attack: Number,
    defense: Number,
    luck: Number,
    coins: Number,
    gender: String,
    password: String,
    weapons: []
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
