var express = require("express");
var app = express();
var router = express.Router();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var methodOverride = require('method-override')
var localStrategy = require("passport-local");
const flash = require('connect-flash');
var User = require("./../models/userDetails.js");
var savedDetails = require("./../models/savedUserModel.js");
var family = require("./../models/familyDetails.js");
var passportLocalMongoose = require("passport-local-mongoose");


router.get("/register", function(req, res) {
    res.render("register");
});


router.post("/register", function(req, res) {
    req.body.username
    req.body.password

    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                //console.log(user);
                req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
                res.redirect("/family");
            })

        }
    })
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", { //used inside app.post as (middleware - code that runs before final callback)
    successRedirect: "/family",
    failureRedirect: "/user/login"
}), function(req, res) {});


router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "loggedOut Sucessfully");
    res.redirect("/family");
});

router.get("/savedConnections", isLoggedIn, function(req, res) {
    savedDetails.find({}, function(err, foundData) {
        if (err) {
            console.log(err);
        } else {
            //console.log(req.params.id);
            //console.log("sai harish"+foundData);
            res.render("savedConnections", { data: foundData, presentUser: req.user._id });
        }
    })
});;



router.post("/:id/:name/:rsvp", isLoggedIn, function(req, res) {

    //let userid=req.params.id
    console.log(req.user);
    let updatedOne = {
        User_ID: req.user._id,
        name: req.params.name,
        rsvp: req.params.rsvp,
        userid: req.params.id

    }
    savedDetails.findOneAndUpdate({
        userid: req.params.id,
    }, updatedOne, function(err, founddata) {
        if (err) {
            console.log(err)
        } else {
            console.log("camehere......................" + founddata);
            //console.log(founddata.name);
            if (founddata != null || undefined) {
                //console.log("sfdgfhgjklk");
                //foundata.up
                req.flash("success", "updated Sucessfully");
                return res.redirect("/user/savedConnections");
            }
        }
        savedDetails.create({
            User_ID: req.user._id,
            rsvp: req.params.rsvp,
            name: req.params.name,
            userid: req.params.id
        }, function(err, savedData) {
            if (err) {
                console.log(err);
            } else {
                //console.log(savedData);
                req.flash("sucsess", "created Sucessfully");
                res.redirect("/user/savedConnections");
            }
        })
    });

});

//app.get("/family")
router.delete("/:id", function(req, res) {
    savedDetails.findOneAndRemove({ userid: req.params.id }, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("error", "user data deleted");
            res.redirect("/user/savedConnections");
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