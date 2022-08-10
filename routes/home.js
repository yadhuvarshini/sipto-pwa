
// db model
var account = require("../model/pfhold");
var cred = require("../model/credential");
//express
 var express = require('express');

 //router
 var router = express.Router();      

 //express error
 var expresserror = require('../utils/expresserror');

 //catch async 
 var catchasync = require('../utils/catchasync');

 var isLoggedIn = require('../middleware/isLoggedIn');
 const ExpressError = require("../utils/expresserror");
 
 //metaverse 
 const axios = require('axios');

 
 const api = axios.create({
  method: 'GET',
  baseURL: 'https://pro-api.coinmarketcap.com',
  headers: {
    'X-CMC_PRO_API_KEY': `027b2aee-ce8c-44ab-afc3-a7967764cddc`,
    Accept: 'application/json',
    'Accept-Encoding': 'deflate, gzip',
  },
});

//
//home
 router.get('/', isLoggedIn , async(req,res) => {
        // let accounts = await account.find({name:req.user.username}, function(err,accounts) {
        //     if(err) throw new expresserror("invalid",404) });

        let accounts = await cred.find({name:req.user.username});
            let n = accounts.length
            accounts = accounts[n-1]
            res.render('home', {accounts});
 });

 router.get("/coinset", isLoggedIn, async(req,res)=> {
   res.render('coinset')
  
});



 router.get("/new", isLoggedIn, function(req,res){
    res.render('new')
 });  



 router.post('/', isLoggedIn, async(req,res) => {
    var _id = req.user._id;
    var Name = req.body.name;
    var assetname = req.body.assetname;
    var holding = req.body.holding;
    var addup = {_id:_id , Name:Name, assetname:assetname , holding:holding};

    var accounts = await cred.Update($set(addup, function(err, newlycreated) {
        if(err) { console.log(err)}
          if(err) throw new expresserror("invalid", 404)
            res.render("new", {account:newlycreated})     
      }));
        res.redirect("/home")
    });

 router.get("/details", isLoggedIn, function(req,res){
    res.render('detail')
 });  

 router.get("/withdraw", isLoggedIn , function(req,res) {
   res.render('withdraw')
 })

 router.get("/meta", isLoggedIn , (req,res) => {
 const url = api('/v1/cryptocurrency/category?id=6053dfb66be1bf5c15e865ee&limit=5')
  .then(response => response.data)
  .then(value => {
   res.render("meta", {value:value.data.coins}) 
  //  res.json(value.data.coins);
  //  a = value.data.coins;
  //  var x = [];
  //   for (var i in a) {
  //       var v = {};
  //       v.id=a[i].id;
  //       v.name = a[i].name;
  //       x[i] = v;
  //   }  
   });
    
});


router.get("/bluechip", isLoggedIn , (req,res) => {
  res.render("bluechip")
})

router.get("/exchanges", isLoggedIn , (req,res) => {
  res.render("exchange")
}) 
 router.post("/:id", isLoggedIn , function(req,res){
    if(!req.params.id) throw new expresserror('Invalid Data', 400);
    var accounts = cred.findById(req.params.id,function(err, foundaccounts){
        if(err) console.log(err); 
        else {   
            res.render("detail", {accounts:foundaccounts});
        } 
    }); 
 }); 

 router.get('/:id', isLoggedIn , async(req,res)=> {
    if(!req.params.id) throw new expresserror('Invalid Data', 400);
    let accounts = await cred.findById(req.params.id);
    res.render('detail', {accounts})
 });        

 
 

module.exports = router;      