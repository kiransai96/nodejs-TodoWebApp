var mongoose = require("mongoose");

var familySchema = new mongoose.Schema({
	name:String,
	age:Number,
	gender:String,
	image:String,
	place:String,
	about:String,
	date:String
});

module.exports = mongoose.model("family",familySchema);