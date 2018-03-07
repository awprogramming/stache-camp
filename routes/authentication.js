const User = require('../models/user');
const SuperUser = require('../models/superUser');
const Camp = require('../models/camp');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/registerSuper', (req,res)=> {
        let superUser = new SuperUser({
            username: req.body.username.toLowerCase(),
            password: req.body.password
        });
        superUser.save((err) => {
                res.json({
                    success:true,
                    message: "Account Registered!"
                });
        });
    });

    router.post('/register-camp', (req,res) => {
        let admin = new User({
            email: req.body.admin_email,
            password: req.body.admin_password,
            first: req.body.admin_first,
            last: req.body.admin_last
        });
        let camp = new Camp({
            name: req.body.name,
            admin: admin,
            users:[admin],
            options:{
                counselor_types:[
                    {
                        type: "general"
                    },
                    {
                        type: "specialist"
                    }
                ],
                headStaff_types:[
                    {
                        type:"leader"
                    },
                    {
                        type:"head_specialist"
                    }
                ]
            }
        });
        camp.save((err) =>{
            if (err) {
                if(err.code === 11000){
                    res.json({
                        success:false,
                        message: "Username or email already exists"
                    });
                }
                else{
                    if(err.errors){
                        if(err.errors.name){
                            res.json({
                                success:false,
                                message: "Camp name required"
                            });
                        }
                        else if(err.errors['users.0.email']){
                            res.json({
                                success:false,
                                message: err.errors['users.0.email'].message
                            });
                        }
                        else if(err.errors['users.0.username']){
                            res.json({
                                success:false,
                                message: err.errors['users.0.username'].message
                            });
                        }
                        else if(err.errors['users.0.password']){
                            res.json({
                                success:false,
                                message: err.errors['users.0.password'].message
                            });
                        }
                        else{
                            res.json({
                                success:false,
                                message: err.errors
                            });
                        }
                    }
                    else{
                        res.json({
                            success:false,
                            message: "Could not save user. Error: " + err
                        });
                    }
                }
            }
            else{
                res.json({
                    success:true,
                    message: "Account Registered!"
                });
            }
        })
    });
    
    router.post('/login',(req,res)=>{
        if (!req.body.email){
            res.json({success:false,message:'No username provided'});
        }
        else if(!req.body.password){
            res.json({success:false,message:'No password provided'});
        }
        else{
            Camp.findOne({users:{$elemMatch:{email:req.body.email.toLowerCase()}}}, (err,camp)=>{
                if(err){
                    res.json({success:false,message:err.message});
                }
                else if(!camp){
                    SuperUser.findOne({username:req.body.email.toLowerCase()}, (err,superuser)=>{
                        if(err){
                            res.json({success:false,message:err});
                        }
                        else if(!superuser){
                            res.json({success:false,message:"Username not found"});
                        }
                        else{
                            validPassword = superuser.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({success:false,message:"Password is not valid"});
                            }
                            else{
                                const token = jwt.sign({userId:superuser._id}, config.secret,{ expiresIn:'100d'});
                                res.json({success:true,message:"Success",token:token, user:{email:superuser.username,permissions:"superuser",modules:[]}});
                            }
                        }
                    });
                    
                }
                else{
                    const admin = camp.admin;
                    Camp.findOne({users:{$elemMatch:{email:req.body.email.toLowerCase()}}},{"users.$":1,modules:1}, (err,camp)=>{

                        const validPassword = camp.users[0].comparePassword(req.body.password);
                        if(!validPassword){
                            res.json({success:false,message:"Password is not valid"});
                        }
                        else{
                            const token = jwt.sign({userId:camp.users[0]._id,campId:camp._id}, config.secret,{ expiresIn:'100d'});
                            if(camp.users[0]._id.equals(admin._id)){
                                res.json({success:true,message:"Success",token:token, user:{_id:camp.users[0]._id,type:"leader",email:camp.users[0].email,permissions:"admin",camp_id:camp._id,modules:camp.modules}});
                            }
                            else{
                                res.json({success:true,message:"Success",token:token, user:{_id:camp.users[0]._id,type:camp.users[0].type,email:camp.users[0].email,permissions:"user",camp_id:camp._id,modules:camp.modules}});
                            }
                            
                        }
                    });
                }
            });
        }
    });

    router.use((req,res,next)=>{
       const token = req.headers['authorization'];
       if(!token){
           res.json({success:false,message:'No token provided'});
       }
       else{
           jwt.verify(token,config.secret,(err,decoded)=>{
                if(err){
                    res.json({succes:false,message:"Token invalid. "+err});
                }
                else{
                    req.decoded = decoded;
                    next();
                }
           });
       }
    });

    return router;
}