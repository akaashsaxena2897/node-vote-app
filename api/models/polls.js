const mongoose = require('mongoose');

// const Contestants = require('../models/contestants');
const voteSchema = new mongoose.Schema({ ip: 'String' });
const contestantSchema = new mongoose.Schema({
   
    name:String,
    voteCount:[voteSchema]
});

const PollSchema = new mongoose.Schema({
   
 question: { type: String, required: true },
 choices: [contestantSchema]
 });

 module.exports=mongoose.model('Poll',PollSchema);