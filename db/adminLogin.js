const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const login=new Schema({
   
        email:{type:String,unique:true,required:true},
        password:{type:String,required:true},
  
});

module.exports=mongoose.model('adminlogin',login);