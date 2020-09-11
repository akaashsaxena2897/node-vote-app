
 const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
 var Poll = require('../models/polls.js');
 

  // JSON API for creating a new poll

router.post('/',(req,res,next)=>{

 var reqBody = req.body,
 choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
 pollObj = {question: reqBody.question, choices: choices};

 var poll = new Poll(pollObj);
 
 poll.save().then(doc => {
 console.log(doc)
 res.status(201).json(doc);
 }).catch(err=> console.log(err));
    

 

});

 // JSON API for list of polls
router.get('/',(req,res,next)=>{
    Poll.find().select('question').exec().then(polls=>{
        const response={
             count:polls.length,
             
         };
        console.log(polls);
       res.status(200).json(polls);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });

  
});

// JSON API for getting a single poll
router.get('/:pollId',(req,res,next)=>{
    var pollId = req.params.pollId;
    Poll.findById(pollId).exec().then(poll=> {
   
        var userVoted = false,
        userChoice,
        totalVotes = 0;
        console.log(req.ip );
        for(c in poll.choices) {
            var choice = poll.choices[c];
        for(v in choice.votes) {
            var voteCount = choice.voteCount[v];
            totalVotes++;
        if(voteCount.ip === (req.header('x-forwarded-for') || req.ip)) {
            
            userVoted = true;
            userChoice = { _id: choice._id, name: choice.name };
            }
        }
        }
            poll.userVoted = userVoted;
            poll.userChoice = userChoice;
            poll.totalVotes = totalVotes;
            console.log('userVoted: ' + userVoted + ' userChoice: '+ userChoice + ' totalVotes: '+ totalVotes);
            res.status(200).json(poll);
        }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
             }); 
      
   
 
 

 });

module.exports = router;