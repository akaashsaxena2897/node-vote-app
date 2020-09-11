const mongoose = require('mongoose');

//A schema basically is an instruction of how objects stored in DB should look like
//A model is then a javascript object with some added functionalities to save,update,fetch data
const contestantsSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    voteCount:{type:Number,required:true,default:0}
});



//Below is a constructor to build an  object on basis of above schema
module.exports= mongoose.model('Contestants',contestantsSchema);