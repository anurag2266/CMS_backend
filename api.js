const express=require('express');
const cors=require('cors');
const bodyParse=require('body-parser');

let adminRoutes=require('./routes/admin');
const port=process.env.PORT || 3000;

const path=require('path');

const app=express();

app.use(cors());
app.use(bodyParse());
app.use('/',adminRoutes);
app.use('/images',express.static('attaches'));

const DB="mongodb+srv://anurag:anurag123@cluster0.hh0zd.mongodb.net/mean?retryWrites=true&w=majority";

// Connecting Database
const mongoose=require('mongoose');
const { getMaxListeners } = require('./db/posts');
mongoose.connect(DB,{ useNewUrlParser: true,createIndexes:true })









// npm i express body-parser sha1 mongoose cors multer --save
// for front
app.use(express.static(path.join(__dirname,"./dist/front/")));

app.use('/',express.static(path.join(__dirname,"./dist/front/")))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./dist/front/"))
})


// for admin
// app.use(express.static(path.join(__dirname,"./dist/admin/")));

// app.use('/',express.static(path.join(__dirname,"./dist/admin/")))

// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,"./dist/admin/"))
// })



app.listen(port,function(){
    console.log(`${port} runing`)
})

