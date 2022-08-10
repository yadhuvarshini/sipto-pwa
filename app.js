//express
var express = require("express");

//bodyparser
var bodyParser = require("body-parser");

//methodoverride
var methodoverride = require('method-override');
  
/*db schema
db user-detail*/
//var user = require("./model/user");

//sign in & up credential schema
var cred = require("./model/credential");

//passport
var passport = require('passport');
var localstrategy = require('passport-local');

//path  
var path = require('path');

//app
var app = express();

//flash
var flash = require('connect-flash');

//routes
//home
var home = require('./routes/home');

//mongoose
var mongoose =  require('mongoose');

//express error
var expresserror = require('./utils/expresserror');

//catch async
var catchasync = require('./utils/catchasync');

//middleware
var isLoggedIn = require('./middleware/isLoggedIn');

//authorization

var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

//mongoose connection
mongoose.connect("mongodb://localhost/sipto");
const db= mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", ()=> {
    console.log("connected");
});

//session handling
app.use(require('express-session')({
    secret:"sipto",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}));

//ejs fw
app.set('view engine','ejs');
app.set('views'); 


//passport intialization for authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(cred.authenticate()));
passport.serializeUser(cred.serializeUser());
passport.deserializeUser(cred.deserializeUser());

//body-parser
app.use(bodyParser.urlencoded({extended:true}));

//method override
app.use(methodoverride('_method'));

app.use((req,res,next)=>{
    //console.log(req.session)
    res.locals.currentUser = req.user;
    next();
})

//directory settings
app.set("views", path.join(__dirname,'views'));
app.set(express.static(path.join(__dirname,'public')));

//flash package for message  
app.use(flash());   


//login
app.get('/', async(req,res)=> {
    res.render("login");              
});    


app.post('/', passport.authenticate("local", {
    failureFlash: true,
    failureRedirect:"/",
}), function(req,res) {
        req.flash('success','welcome');
        const redirectUrl = req.session.returnTo || '/home';
        res.redirect(redirectUrl);
 });
             
          
//register     

app.get('/register', function(req,res) {
    res.render("register");
});

app.post('/register', async(req,res) => {
    var newUser = new cred({username:req.body.username , email:req.body.email, pno:req.body.phno});
   await cred.register(newUser, req.body.password, function(err,user) {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res, function() {
            res.redirect('/home');
        });
    });
});    

//routes

app.get('/logout', catchasync(async(req,res, next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        else {
            res.redirect('/');
        }
    });
})); 

app.use("/home", home);

app.all('*', (req,res,next) => {
    next(new expresserror('page not found',404 ))
});

app.use((err,req,res,next) => {
    const {
        statusCode = 500, message="something is wrong please go back" + "/home"
    } = err;

    res.status(statusCode).render('404', {err})
    next();
});

app.listen(7000);
console.log("http://localhost:7000");
   