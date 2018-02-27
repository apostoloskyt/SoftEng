/*
Contains all API calls for an event.
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Event = require('../models/event.js');
var Fuse = require('fuse.js');




//handle user search
router.get('/findEvents/:tag/:qu?',function(req,res){

    console.log(req.params.qu)
    console.log(req.params.tag)
    console.log("Current Date and Time:")
    var datetime = new Date();
    console.log(datetime)

if (req.params.tag != 'all'){
   Event.find( { end_time: { $gt: datetime }, category:{ $eq:req.params.tag } }, function (err, events) {
      if (err)
        res.send(err);


 	  /*decodeURIComponent(req.params.qu);*/
 	  if (req.params.qu =="undefined" || req.params.qu == null  ) res.json(events);
 	  else
 	  {
 	  	var options = {
  	shouldSort: true,
  	tokenize: true,
  	matchAllTokens: true,
  	threshold: 0.6,
  	location: 0,
  	distance: 100,
  	maxPatternLength: 32,
  	minMatchCharLength: 5,
  	keys: [
    "eventname",
    "description",
    "location.formatted_address",
    "category",
	]
	};
      var fuse = new Fuse(events, options); // "list" is the item array
	  var result = fuse.search(req.params.qu);
      res.json(result);
  	  }
    });
}
else{
    Event.find( { end_time: { $gt: datetime }}, function (err, events) {
        if (err)
          res.send(err);
  
  
         /*decodeURIComponent(req.params.qu);*/
         if (req.params.qu =="undefined" || req.params.qu == null  ) res.json(events);
         else
         {
             var options = {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 5,
        keys: [
      "eventname",
      "description",
      "location.formatted_address",
      "category",
      ]
      };
        var fuse = new Fuse(events, options); // "list" is the item array
        var result = fuse.search(req.params.qu);
        res.json(result);
          }
      });
}
})	

//POST message for event creation, not all necessairy data included yet
router.post("/createEvent", function(req, res) {  
    //var t = parseInt(req.body.tickets);
    //var t=0;
    console.log(req.body.eventname)
    console.log(req.body.category)
    console.log(req.body.price)
    console.log(req.body.description)
    console.log(req.body.minage)
    console.log(req.body.maxage)
    console.log(req.body.provider)
    console.log(req.body.start_time)
    console.log(req.body.end_time)



    var ev = new Event({
        eventname: req.body.eventname,
        category: req.body.category,
		    price: req.body.price,
        picture:req.body.picture,
		    description: req.body.description,
		    minage: req.body.minage,
		    maxage: req.body.maxage,
        provider:req.body.provider,
        location:req.body.location,
        tickets: req.body.tickets,
        start_time: req.body.start_time,
        end_time: req.body.end_time
    });

    ev.save(function(err, status) {
        if (err) return res.json(err);
        return res.json(status);			//status in fact is data, just for debugging
    });
})

router.post('/updateTickets', function(req,res){
  var tic = parseInt(req.body.notickets);
  Event.findOne({eventname:req.body.eventname}, function(err,doc){
      doc.tickets = doc.tickets - tic;
      doc.ticketspur=doc.ticketspur+tic;
      doc.money= doc.money + parseInt(doc.price)*tic;
      doc.save();
    });
})

//handle user single event click
router.get("/singleEvent/:id?", function(req, res) {  
    Event.findById(req.params.id, function(err, event){
    if (err){
      res.send(err);
    }  
    event.timesVisited++;
    console.log("times visited")
    console.log(event.timesVisited)
    event.save();
    res.json(event);
  });
})

router.get("/singleEvents/:id?", function(req, res) {  
    Event.findById(req.params.id, function(err, event){
    if (err)
      res.send(err);
    res.json(event);
  });
})


module.exports = router;