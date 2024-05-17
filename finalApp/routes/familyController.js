var express = require("express");
var app = express();
var router = express.Router();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var methodOverride = require('method-override')
const flash = require('connect-flash');
var localStrategy = require("passport-local");
var User = require("./../models/userDetails.js");
var savedDetails = require("./../models/savedUserModel.js");
var family = require("./../models/familyDetails.js");
var passportLocalMongoose = require("passport-local-mongoose");


// router.get("/",function(req,res){
// 	res.render("index.ejs");
// });


router.get("/", function(req, res) {
    console.log(req.user);
    family.find({}, function(err, category) {
        var category1 = []
        let data = [];

        for (var i = 0; i < category.length; i++) {
            data.push(category[i].gender.toLowerCase());
        }
        data.forEach((element) => {
            if (!category1.includes(element)) {
                category1.push(element)
            }
        })
        console.log(category1);
        res.render("family", { members: category, category: category1 });
    });

});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("addMember");
});

router.post("/", function(req, res) {

    var newMember = {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        image: req.body.image,
        place: req.body.place,
        about: req.body.about,
        date: req.body.date
    }
    family.create(newMember, function(err, member) {
        if (err) {
            console.log(err);
        } else {
            console.log(member);
            res.redirect("/family");
        }
    })

})

router.get("/:id", isLoggedIn, function(req, res) {
    var id = req.params.id;
    family.findById(req.params.id, function(err, foundMember) {
        if (err) {
            res.redirect("back");
        } else {
            console.log(foundMember);;
            res.render("MemberDetails", { member: foundMember });
        }
    })
})



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "please login first");
        res.redirect("/user/login");
    }
}

module.exports = router;