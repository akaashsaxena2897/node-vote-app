const express = require('express');
const router = express.Router();
/****MODEL*****/
const Contestants = require('../models/contestants');
const Poll = require('../models/polls');
const mongoose = require('mongoose');
/***Image upload*****/
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
});
const upload = multer({storage:storage});
/****Token Authentication*** */
const checkAuth = require('../middleware/check-auth');

router.get('/', (req,res,next) => {

     Contestants.find().select('name voteCount _id').exec().then(docs=>{
         const response={
             count:docs.length,
             contestants:docs
         };
        console.log("List from database",docs); 
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });

   
});
router.post('/',checkAuth,upload.single('contestantImage'),(req,res,next) => {

     console.log(req.file);
    const contestants = new Contestants({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,  
       voteCount:req.body.voteCount
    });
    contestants.save().then(result=>{ //method used to store data into Mongoose DB
        console.log(result);
    }).catch(err=> console.log(err));
    res.status(200).json({
        message: 'Handling post requests',
        createdContestants:contestants
    });
});

router.patch('/:contestantName',checkAuth,(req,res,next)=>{
   const id = req.params.contestantName;
   const updateOperations = {};
   for(const ops of req.body){
       updateOperations[ops.propName]= ops.value; //to perform different patch operations as and when required
   }
    Contestants.update({_id:id},{$set:updateOperations})
    .exec()//used to return promise
    .then(result=>{ 
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

    
    res.status(200).json({
        message:"Updated Contestant Details",

    });
});

router.get('/:contestantName',(req,res,next)=>{
    
    const id = req.params.contestantName;
    Contestants.findById(id).exec().then(doc=>{
        console.log("From database",doc); 
        
        res.status(200).json(doc);
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });

    if(id==="banana"){
            res.status(200).json({
                message:'Handling Special ID',
               id:id 
               
               });
    }
    
    
});

router.delete("/:contestantsName", checkAuth,(req,res,next)=>{
    const id = req.params.contestantsName;
    Contestants.remove({_id:id}).exec().then(result =>
    {
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

// router.get('/polls/pollList',(req,res,next)=>{
//     Poll.find().select('question').exec().then(polls=>{
//         const response={
//              count:polls.length,
             
//          };
//         console.log(polls);
//        res.status(200).json(polls);
//     }).catch(err => {
//         console.log(err);
//         res.status(500).json({error:err});
//     });

  
// })



// router.post('/polls/createPoll',(req,res,next)=>{

//  var reqBody = req.body,
//  choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
//  pollObj = {question: reqBody.question, choices: choices};

//  var poll = new Poll(pollObj);
 
//  poll.save().then(doc => {
//  console.log(doc)
//  res.status(201).json(doc);
//  }).catch(err=> console.log(err));
    

 

// });

// router.get('/polls/:pollId',(req,res,next)=>{
//     var pollId = req.params.id;
//     Poll.findById(pollId, '', { lean: true }, function(err, poll) {
//     if(poll) {
//         var userVoted = false,
//         userChoice,
//         totalVotes = 0;
//         for(c in poll.choices) {
//             var choice = poll.choices[c];
//         for(v in choice.votes) {
//             var voteCount = choice.voteCount[v];
//             totalVotes++;
//         if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
//             userVoted = true;
//             userChoice = { _id: choice._id, text: choice.name };
//             }
//         }
//         }
//             poll.userVoted = userVoted;
//             poll.userChoice = userChoice;
//             poll.totalVotes = totalVotes;
//             res.status(200).json(poll);
//         } else {
//             res.status(500).json({error:true});
//         }
//         });
   
 
 

//  });
module.exports = router;