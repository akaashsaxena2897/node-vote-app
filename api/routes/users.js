const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.get('/',(req,res,next)=>{
    Users.find().select('name email password contestantSelected _id')
    .exec().then(docs=>{
        const response={
             count:docs.length,
             user:docs.map(doc=>{
                 return{
                     name:doc.name,
                   
                    _id:doc._id
                 }
             })
         };
        console.log("List from database",docs); 
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.post('/',(req,res,next)=>{

    const users = new Users({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,  
         email:req.body.email,
       contestantSelected:req.body.contestantSelected
    });
    users.save().then(doc=>{ //method used to store data into Mongoose DB
        console.log(doc);
        res.status(201).json({
            createdUsers:{
                name:doc.name,
                    contestantSelected:doc.contestantSelected,
                    _id:doc._id
        
        
            }
        })
    }).catch(err=> console.log(err)
    );
  
    
});

router.patch('/:userId',(req,res,next)=>{
    const id = req.params.userId;
   const updateOperations = {};
   for(const ops of req.body){
       updateOperations[ops.propName]= ops.value; //to perform different patch operations as and when required
   }
    Users.update({_id:id},{$set:updateOperations})
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
router.get('/:userId',(req,res,next)=>{

    const id = req.params.userId;
    Users.findById(id).exec().then(doc=>{
        console.log("From database",doc); 
        
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
router.delete('/:userId',(req,res,next)=>{

 const id = req.params.userId;
    Users.remove({_id:id}).exec().then(result =>
    {
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
     
    
});


/**User Sign in and Sign up Routes*** */

router.post('/signup',(req,res,next)=>{

        Users.find({email: req.body.email})
        .exec()
        .then(user=>{
            if(user.length>=1){
                return res.status(409).json({
                    message : 'Dorime _/\\_'
                });
            }else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.status(500).json({
                    error:err
                });
            } else {
                const user = new Users({

                    _id:new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email:req.body.email,
                    password:hash
                });
                user.save()
                .then(result=>{
                    console.log(result);
                    res.status(201).json({
                        message:'User Created'
                    });
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    });
                });
            }

            
        });
            }
        });
        

    
});

router.post('/login',(req,res,next)=>{
    Users.findOne({ email : req.body.email})
    .exec()
    .then(user=>{
        console.log('User login '+ req.body);
        if(user.length<1){
            return res.status(401).json({
                message: "User doesnt exist"
            });
        }
        bcrypt.compare(req.body.password, user.password,(err,result)=> {
       
        
       if (result){

           if(req.body.password){
            console.log('User login '+ result);
          const token = jwt.sign({
               email:user.email,
               userId:user.id
           },process.env.JWT_KEY,{
               expiresIn:"1h"
           });
           console.log(result);
            return res.status(200).json({
                success: true,
                message:"Auth successful",
                token:token

            });

           }
           else{
               return res.status(401).json({
                success: false,
                message:"No Password Provided",
                token:token

            });


           }
          
        }
        else{
            return res.status(401).json({
                message:"Auth failed : Incorrect credentials",
                success:false
            });
        }

        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:err
        });
    });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.use('/userToken',function(req,res,next){

    var token = req.body.token||req.body.query||req.headers['x-access-token'];
    console.log(token);
        if(token){
             jwt.verify(token,process.env.JWT_KEY,function(err,decoded){
                 if(err){
                     res.json({
                         success:false,
                         message:err
                     });

                 }else{
                     req.decoded = decoded;
                     console.log(req.decoded);
                     next();
                 }
             });
        }else{
            res.json({success:false,message:'No token provided'});
        }

})

router.post('/userToken',function(req,res){
    res.send(req.decoded);
});

module.exports = router;