const mongoose = require('mongoose');
// const Contestants = require('../models/contestants');
const voteSchema = new mongoose.Schema({ ip: 'String' });
const contestantsSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    voteCount:[voteSchema]
});

const PollSchema = new mongoose.Schema({
 question: { type: String, required: true },
 choices: [contestantsSchema]
 });

 module.exports=mongoose.model('Poll',PollSchema);