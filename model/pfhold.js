var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new mongoose.Schema({
    assetname: String,
    holding: Number,
});

accountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("account", accountSchema);