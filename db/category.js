const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const cat=new Schema({
   
        cname:{type:String,unique:true},
        cabout:{type:String,required:true},
        image:{type:String,required:true},
        created_at:{type:Date,default:Date.now()}
  
});

module.exports=mongoose.model('category',cat);