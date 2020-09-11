const mongoose = require('mongoose');

//A schema basically is an instruction of how objects stored in DB should look like
//A model is then a javascript object with some added functionalities to save,update,fetch data
const usersSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {type:String,required:true},
    email:{type:String,required:true,unique:true,match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    password:{type:String, required:true},
    contestantSelected:{type:mongoose.Schema.Types.ObjectId,ref:'Contestants',default:null}
});

//Below is a constructor to build an  object on basis of above schema
module.exports= mongoose.model('Users',usersSchema);