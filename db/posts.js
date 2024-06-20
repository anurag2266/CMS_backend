const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const postSchema=new Schema({
   
        title:{type:String,unique:true},
        catname:{type:String,required:true},
        image:{type:String,required:true},
        description:{type:String,required:true},
        postedBy:{type:String,required:true},
        created_at:{type:Date,default:Date.now()}
  
});

module.exports=mongoose.model('posts',postSchema);