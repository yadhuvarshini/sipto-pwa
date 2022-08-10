var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var credSchema = new mongoose.Schema({
    Name: String,
    Phonenumber: Number,
    email: String,
    assetname: String,
    holding: Number,
});

credSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("cred", credSchema);