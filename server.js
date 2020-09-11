const http = require('http');
const port = process.env.PORT ||3000;
const app = require ('./app');

const server = http.createServer(app);
const io = require('socket.io')(server);



io.sockets.on('connection', function(socket) {
    console.log('Connected');
    setTimeout(function() {
      socket.send('Sent a message 4seconds after connection!');
   }, 4000);
    socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
     socket.on('send:vote', function(data) {
         console.log('snd:vote');
            var ip = socket.handshake.headers['x-forwarded-for'] ||
            socket.handshake.address.address;
            console.log(ip);
            Poll.findById(data.poll_id).exec().then(poll=>{
                console.log(poll);  
                var choice = poll.choices.id(data.choice);
                choice.voteCount.push({ ip: ip });
                console.log(choice.voteCount);
                poll.save().exec().then(function(err, doc) {
                 var theDoc = {
                                question: doc.question, _id: doc._id, choices: doc.choices,
                                userVoted: false, totalVotes: 0
                             };
                for(var i = 0, ln = doc.choices.length; i < ln; i++) {
                    var choice = doc.choices[i];
                 for(var j = 0, jLn = choice.voteCount.length; j < jLn; j++) {
                    var vote = choice.voteCount[j];
                theDoc.totalVotes++;
                theDoc.ip = ip;
                if(vote.ip === ip) {
                    theDoc.userVoted = true;
                    theDoc.userChoice = { _id: choice._id, text: choice.text };
                    }
                }
             }
                 io.sockets.emit('myvote', theDoc);
                socket.broadcast.emit('vote', theDoc);
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({error:err});
             }); 
           
        });

 });


server.listen(port);