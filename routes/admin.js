const express=require('express')
const adminLogin=require('../db/adminLogin');
const sha1=require('sha1')
const catModel=require('../db/category');
const postModel=require('../db/posts');
const contactModel=require('../db/contact');
const fs=require('fs');

const nodemailer = require("nodemailer");

// for file upload
const multer=require('multer');

let DIR="./attaches";

let myStorage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,DIR)
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+'.'+file.originalname.split('.')
        [file.originalname.split('.').length-1]
        )
    }
})

let upload= multer({storage:myStorage}).single('Image');
// fileuploading ends





router=express.Router()
// Define api
router.post('/api/loginadmin',function(req,res){
    let email=req.body.email;
    let password=sha1(req.body.password);
    //for login
    adminLogin.find({'email':email,'password':password},function(err,data){
        if(err){
            res.json({'err':1,'msg':'Some Error Please Try Again Later'})
        }else if(data.length==0){
            res.json({'err':1,'msg':'Please Enter Correct Details'})
        }else{
            res.json({'err':0,'msg':'Success','id':email});
        }
    })

    // insert new user
    // let insertUser=new adminLogin({
    //     'email': email,
    //     'password':password
    // });
    // insertUser.save(function(err){
    //     if(err){
    //         res.json({'err':1,'msg':'Not Added'});
    //     }else{
    //         res.json({'err':0,'msg':'Added Successfully'})
    //     }
    // })
})

router.post('/api/addcategory',(req,res)=>{
    upload(req,res,function(err){
        if(err){
            res.json({'err':1,'msg':'Error In Uploading'});
        }else{
            let cname=req.body.cname;
            let cabout=req.body.cabout;
            let fname=req.file.filename;

            // for adding mongo
            let ins=new catModel({'cname':cname,'cabout':cabout,'image':fname});

            ins.save(function(err){
                if(err){
                    res.json({'err':1,'msg':'Error In Inserting DB'});
                }else{
                    res.json({'err':0,'msg':'Success'});
                }
            })
        }
    })
})

// read category
router.get('/api/getcategory',(req,res)=>{
    catModel.find({},function(err,data){
        if(err){
            res.json({'err':1,'msg':'Some Error In Fetching'})
        }else{
            res.json({'err':0,'msg':data})
        }
    })
})
// delete category
router.get('/api/delcat/:cid',(req,res)=>{
    let catid=req.params.cid;
    catModel.findOne({'_id':catid},function(err,data){
       
        if(err){
            res.json({'err':1,'msg':err})
        }else{
            let path=DIR+"/"+data.image;
            
            
            catModel.deleteOne({'_id':catid},function(err){
                if(err){
                    res.json({'err':1,'msg':'Category Not Deleted'})
                }else{
                    fs.unlink(path, (err) => {
                        if (err) {
                            console.error(err)
                         } 
                    })
                    res.json({'err':0,'msg':'Category Deleted'})
                }
            })
        }
    })
    
})

// fetchcat
router.get('/api/fetchcat/:cname',(req,res)=>{
    let catname=req.params.cname;
    catModel.findOne({'cname':catname},function(err,data){
        if(err){
            res.json({'err':1,'msg':err})
        }else{
            res.json({'err':0,'msg':data})
        }
    })
})

// get posts
router.get('/api/getposts',(req,res)=>{
    postModel.find({},function(err,data){
        if(err){
            res.json({'err':1,'msg':'Some Error In Fetching'})
        }else{
            res.json({'err':0,'msg':data})
        }
    })
})

router.get('/api/getpostsbycat/:catname',(req,res)=>{
    let cname=req.params.catname;
    // cname=cname.toLowerCase();
    postModel.find({'catname':cname},function(err,data){
        if(err){

        }else{
            res.json({'err':0,'msg':data})
        }
    })

})

router.get('/api/getpostsbyid/:pid',(req,res)=>{
    let postId=req.params.pid;
    postModel.findById({'_id':postId},(err,data)=>{
         if(err){
            res.json({'err':1,'msg':err})
        }else{
            res.json({'err':0,'msg':data})
        }
    })
})


// change or update
router.post('/api/changepass',(req,res)=>{
    // op -> old pass,np -> new pass
    let op=sha1(req.body.opass);
    let np=sha1(req.body.npass);
    let email=req.body.email;

    adminLogin.findOne({'email':email},function(err,data){
        if(err){

        }else{
            if(op==data.password){
                if(data.password==np){
                    res.json({'err':1,'msg':'Old Pass And New Pass Cant Be Same'})
                }else{
                    adminLogin.updateOne({'email':email},{$set:{'password':np}},function(err){
                        if(err){
                            res.json({'err':1,'msg':'Some Error'})
                        }else{
                            res.json({'err':0,'msg':'Password Change Successfully'})
                        }
                    })
                }
            }else{
                res.json({'err':1,'msg':'Please Choose Correct Old Password'})
            }
        }
    })
});

// add-post
router.post('/api/addpost',(req,res)=>{
    upload(req,res,function(err){
        if(err){
            res.json({'err':1,'msg':'Error In Uploading'});
        }else{
            let ptitle=req.body.ptitle;
            let pcat=req.body.pcat;
            let fname=req.file.filename;
            let description=req.body.description;
            let postedBy=req.body.postedBy;

            // for adding mongo
            let ins=new postModel({'title':ptitle,'catname':pcat,'image':fname,'description':description,'postedBy':postedBy});

            ins.save(function(err){
                if(err){
                    res.json({'err':1,'msg':'Error In Inserting DB'});
                }else{
                    res.json({'err':0,'msg':'Success'});
                }
            })
        }
    })
})

router.post('/api/contact',(req,res)=>{

            let name=req.body.name;
            let mobile=req.body.mobile;
            let message=req.body.message;

            // for adding mongo
            let ins=new contactModel({'name':name,'mobile':mobile,'message':message});

            ins.save(function(err){
                if(err){
                    res.json({'err':1,'msg':'Error In Inserting DB'});
                }else{
                    // node mailer


                    // async..await is not allowed in global scope, must use a wrapper
                    async function main() {
                        // Generate test SMTP service account from ethereal.email
                        // Only needed if you don't have a real mail account for testing
                        let testAccount = await nodemailer.createTestAccount();
                    
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                        
                        host: "smtp.hostinger.in",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'anurag@radioharyanvi.com', // generated ethereal user
                            pass: 'Anurag123@', // generated ethereal password
                        },
                        });
                    
                        // send mail with defined transport object
                        let info = await transporter.sendMail({
                        from: '"Fred Foo 👻" <anurag@radioharyanvi.com>', // sender address
                        to: "anurag200047@gmail.com,punia.umesh@gmail.com", // list of receivers
                        subject: "Contact Us Form", // Subject line
                        text: `
                            Name :- ${name},
                            Mobile :- ${mobile},
                            Message :- ${message} 
                        `, // plain text body
                        // html: "<b>Mail Sent Success</b>", // html body
                        });
                    
                        console.log("Message sent: %s", info.messageId);
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    
                        // Preview only available when sending through an Ethereal account
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    }
                    
                    main().catch(console.error);
  
                    res.json({'err':0,'msg':'Success'});
                }
            })
})

router.get('/api/getcontact',(req,res)=>{
    contactModel.find({},function(err,data){
        if(err){
            res.json({'err':1,'msg':'Some Error In Fetching'})
        }else{
            res.json({'err':0,'msg':data})
        }
    })
})


module.exports=router