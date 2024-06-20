const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const contact=new Schema({
   
        name:{type:String,required:true},
        mobile:{type:String,required:true},
        message:{type:String,required:true},
        contacted_on:{type:Date,default:Date.now()}
  
});

module.exports=mongoose.model('contact',contact);