var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var methodOverride = require('method-override')
var localStrategy = require("passport-local");
var User = require("./models/userDetails.js");
var savedDetails = require("./models/savedUserModel.js");
var connectionControl = require("./routes/familyController.js");
var userControl = require("./routes/profileController.js")
var family = require("./models/familyDetails.js");
var passportLocalMongoose = require("passport-local-mongoose");
const flash = require('connect-flash');

var app = express();

//var userNumber = Math.floor(Math.random)

mongoose.connect("mongodb://localhost:27017/finalApp", { useNewUrlParser: true, useUnifiedTopology: true })

app.set("view engine", "ejs");

app.use('/resources', express.static("assets"));


app.use(methodOverride('_method'))
app.use(session({
    secret: "this is sai harish paleti",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
    console.log("came here......." + req.user);
    res.locals.currentUser = req.user;
    next();
});
app.use('/family', connectionControl);
app.use('/user', userControl);

app.listen(3000, function(req, res) {
    console.log("server started........!!");
})