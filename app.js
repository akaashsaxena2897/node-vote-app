//Setup our DB via mongoose

// const mongoose =    require('mongoose');

// const http = require('http');



// const express = require ('express');

// const path = require('path');
// //Setup an express application which allows us to use various utilities in it
// const app = express(); 

// const morgan = require('morgan');

// //Setup a middleware which now handles all the requests, it'll be able to handle 
// //different paratameters that'll be available in that request
// //if request has those parameters we then transfer request to next middleware

// // app.use((req,res,next)=>{
// //     res.status(200).json({
// //         message:'it worked!'
// //     });

// // });
// //However all requests go through this middleware, if we want to route we gotta 
// //separate this middleware and provide it route

// // we use parser package to parse the body of incoming request

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// // setting up our routes for contestants
// const contestantsRoutes = require('./api/routes/contestants');
// const userRoutes = require('./api/routes/users');
// const pollRoutes = require('./api/routes/polls');
// app.use(morgan('dev')); //used for setting up login services
// //This is where we set up the routing
// app.use('/contestants',contestantsRoutes);
// app.use('/users',userRoutes);
// // 

// //Polls ke controller
// app.use('/polls', pollRoutes);


// //Handling CORS request
// app.use((req,res,next)=>{
    
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
//     if(req.method==='OPTIONS') //pre-flight requests to see if original request is safe
//     {
//         res.headers('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
//         return res.status(200).json({}); // we return an empty body finally in response to CORS request, 
//         //because the request is for OPTIONS and we respond in form of headers containing Origin,X-Requested etc. 
//         //Toh alag se kuch response nahi return karna, however, empty json show that our request has indeed been accepted
//     }
//     next(); // this allow other routes to take over while we try to deal with OPTIONS request if we DO get one
// });

// app.use(express.static(__dirname+'/client'));
// app.get('*',function(req,res){
//     res.sendFile(path.join(__dirname+'/client/index.html'));

// });
// //ERROR HANDLING

// /****404*****/

// app.use((req,res,next)=>{
//     const error = new Error('Not found');
//     error.status = 404;
//     next(error);
// })

// app.use((error,req,res,next)=>{
//     res.status(error.status||500);
//     res.json({
//         error:{
//             message:error.message
//         }
//     });
// });
// const server = http.createServer(app);
// const io = require('socket.io')(server);

 
// const router = express.Router();
//  var Poll = require('./api/models/polls.js');


// io.sockets.on('connection', function(socket) {
//     console.log('Connected');
//      socket.on('send:vote', function(data) {
//          console.log('snd:vote');
//             var ip = socket.handshake.headers['x-forwarded-for'] ||
//             socket.handshake.address.address;
//             console.log(ip);
//             Poll.findById(data.poll_id).exec().then(poll=>{
//                 console.log(poll);  
//                 var choice = poll.choices.id(data.choice);
//                 choice.voteCount.push({ ip: ip });
//                 console.log(choice.voteCount);
//                 poll.save().exec().then(function(err, doc) {
//                  var theDoc = {
//                                 question: doc.question, _id: doc._id, choices: doc.choices,
//                                 userVoted: false, totalVotes: 0
//                              };
//                 for(var i = 0, ln = doc.choices.length; i < ln; i++) {
//                     var choice = doc.choices[i];
//                  for(var j = 0, jLn = choice.voteCount.length; j < jLn; j++) {
//                     var vote = choice.voteCount[j];
//                 theDoc.totalVotes++;
//                 theDoc.ip = ip;
//                 if(vote.ip === ip) {
//                     theDoc.userVoted = true;
//                     theDoc.userChoice = { _id: choice._id, text: choice.text };
//                     }
//                 }
//              }
//                  io.sockets.emit('myvote', theDoc);
//                 socket.broadcast.emit('vote', theDoc);
//                 });
//             }).catch(err => {
//                 console.log(err);
//                 res.status(500).json({error:err});
//              }); 
           
//         });

//  });


 


// module.exports = app;

/****DATABASE******/
// mongoose.connect('mongodb+srv://admin:'+process.env.MONGO_ATLAS_PW+'@node-vote-app.5xyko.mongodb.net/node-vote-app?retryWrites=true&w=majority',
// {
//      useNewUrlParser: true, 
//     useUnifiedTopology: true 
// }
// );


// //To avoid hardcoding our password here, we use process.env.MONGO_ATLAS_PW


// /***NODE MON****/
// //In order to not constantly restart our server on editing we install something called NODE MON




//Setup our DB via mongoose

const mongoose = require('mongoose');

const http = require('http');


var _ = require('lodash');
const express = require('express');

const path = require('path');
//Setup an express application which allows us to use various utilities in it
const app = express();

const morgan = require('morgan');
const port = process.env.PORT || 3000;

//Setup a middleware which now handles all the requests, it'll be able to handle 
//different paratameters that'll be available in that request
//if request has those parameters we then transfer request to next middleware

// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'it worked!'
//     });

// });
//However all requests go through this middleware, if we want to route we gotta 
//separate this middleware and provide it route

// we use parser package to parse the body of incoming request

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// setting up our routes for contestants
const contestantsRoutes = require('./api/routes/contestants');
const userRoutes = require('./api/routes/users');
const pollRoutes = require('./api/routes/polls');
app.use(morgan('dev')); //used for setting up login services
//This is where we set up the routing
app.use('/contestants', contestantsRoutes);
app.use('/users', userRoutes);
// 

//Polls ke controller
app.use('/polls', pollRoutes);


//Handling CORS request
app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') //pre-flight requests to see if original request is safe
    {
        res.headers('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({}); // we return an empty body finally in response to CORS request, 
        //because the request is for OPTIONS and we respond in form of headers containing Origin,X-Requested etc. 
        //Toh alag se kuch response nahi return karna, however, empty json show that our request has indeed been accepted
    }
    next(); // this allow other routes to take over while we try to deal with OPTIONS request if we DO get one
});

app.use(express.static(__dirname + '/client'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));

});
//ERROR HANDLING

/****404*****/

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
const server = http.createServer(app);
const io = require('socket.io')(server);

var Poll = require('./api/models/polls.js');


io.sockets.on('connection', function (socket) {
    console.log('Connected');
    socket.on('send:vote', function (data) {
       console.log('data:=> '+ data.choice);
        var ip = socket.handshake.headers["x-real-ip"] ||
            socket.handshake.address;
        console.log('ip '+ data.ip);
        Poll.findById(data.poll_id).exec().then(poll => {
            console.log('poll=>: '+poll.choices);
            var choice= _.find(poll.choices, function(obj) { 
                      if (obj._id==data.choice) { 
                        return true; 
                    } 
            });
            
             console.log('choice=>: '+choice);
            choice.voteCount.push({ ip: ip });
            
            poll.save().then(doc=> {
               
                var theDoc = {
                    question: doc.question, 
                    _id: doc._id, 
                    choices: doc.choices,
                    userVoted: false, 
                    totalVotes: 0
                };
                for (var i = 0, ln = doc.choices.length; i < ln; i++) {
                    var choice = doc.choices[i];
                    for (var j = 0, jLn = choice.voteCount.length; j < jLn; j++) {
                        var vote = choice.voteCount[j];
                        theDoc.totalVotes++;
                        theDoc.ip = ip;
                        if (vote.ip === ip) {
                            theDoc.userVoted = true;
                            theDoc.userChoice = { _id: choice._id, name: choice.name };
                           console.log("data: "+theDoc.ip);
                        }
                    }
                }
                io.sockets.emit('myvote', theDoc);
                socket.broadcast.emit('vote', theDoc);
           
        }).catch(err => {
            console.log(err);
            return ({ error: err });
        });

     });
    });
});
var config = {
  apiDomain: 'https://api.loginradius.com',
  apiKey: 'c2de6c68-0355-473f-99dd-722eff7f6ef9',
  apiSecret: 'd76158dc-2973-402d-b99c-1f389212b7c2',
  siteName: 'dev-node-vote-app',
  apiRequestSigning: false,
};

var lrv2 = require('loginradius-sdk')(config);


/****DATABASE******/
mongoose.connect('mongodb+srv://admin:'+process.env.MONGO_ATLAS_PW+'@node-vote-app.5xyko.mongodb.net/node-vote-app?retryWrites=true&w=majority',
{
     useNewUrlParser: true, 
    useUnifiedTopology: true 
}
);


server.listen(port, function(){
 console.log('Express server listening on port ' + port);
});
