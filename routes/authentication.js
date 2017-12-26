const User = require('../models/user');
const SuperUser = require('../models/superUser');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
    router.post('/register', (req,res)=> {
        if(!req.body.email){
            res.json({success:false,message:"You must provide an email"});
        } 
        else if(!req.body.username){
            res.json({success:false,message:"You must provide a username"});
        }
        else if(!req.body.password){
            res.json({success:false,message:"You must provide a password"});
        }
        else{
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });
            user.save((err) => {
                if (err) {
                    if(err.code === 11000){
                        res.json({
                            success:false,
                            message: "Username or email already exists"
                        });
                    }
                    else{
                        if(err.errors){
                            if(err.errors.email){
                                res.json({
                                    success:false,
                                    message: err.errors.email.message
                                });
                            }
                            else if(err.errors.username){
                                res.json({
                                    success:false,
                                    message: err.errors.username.message
                                });
                            }
                            else if(err.errors.password){
                                res.json({
                                    success:false,
                                    message: err.errors.password.message
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
            });
        }
    });

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

    router.post('/login',(req,res)=>{
        if (!req.body.username){
            res.json({success:false,message:'No username provided'});
        }
        else if(!req.body.password){
            res.json({success:false,message:'No password provided'});
        }
        else{
            User.findOne({username:req.body.username.toLowerCase()}, (err,user)=>{
                if(err){
                    res.json({success:false,message:err});
                }
                else if(!user){
                    SuperUser.findOne({username:req.body.username.toLowerCase()}, (err,superuser)=>{
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
                                const token = jwt.sign({userId:superuser._id}, config.secret,{ expiresIn:'24h'});
                                res.json({success:true,message:"Success",token:token, user:{username:superuser.username,permissions:"superuser"}});
                            }
                        }
                    });
                    
                }
                else{
                    const validPassword = user.comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({success:false,message:"Password is not valid"});
                    }
                    else{
                        const token = jwt.sign({userId:user._id}, config.secret,{ expiresIn:'24h'});
                        res.json({success:true,message:"Success",token:token, user:{username:user.username,permissions:"user"}});
                    }
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

    router.get('/dashboard', (req,res)=>{
        User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else if(!user){
                SuperUser.findOne({_id:req.decoded.userId}).select('username email').exec((err,superuser)=>{
                    if(err){
                        res.json({success:false,message:err});
                    }else if(!superuser){
                        res.json({success:false,message:"User not found"});
                    }else{
                        res.json({success:true,user:superuser});
                    }
                });
            }else{
                res.json({success:true,user:user});
            }
        });
    });

    return router;
}