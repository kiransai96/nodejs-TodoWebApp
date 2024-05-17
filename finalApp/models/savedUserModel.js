var mongoose = require("mongoose");


var detailsSchema = new mongoose.Schema({
	
	User_ID:String,
	rsvp : String,
	name: String,
	userid:String
});
	
//	var mongoose    = require("mongoose");

// var commentSchema = mongoose.Schema({
//     text: String,
//     author: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },
//         username: String
//     }
// });

// module.exports.findUnique12 = (userid) =>{
// 	detailsSchema.find({userid:userid},function(err,founddata){
// 		if(err){
// 			console.log(err)
// 		}else{
// 			return founddata;
// 		}
// 	})
// }

module.exports = mongoose.model("savedDetails",detailsSchema);