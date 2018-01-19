const User = require('../models/user');
const SuperUser = require('../models/superUser');
const Camp = require('../models/camp');
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

    router.post('/register-camp', (req,res) => {
        let admin = new User({
            email: req.body.admin_email,
            username: req.body.admin_username,
            password: req.body.admin_password
        });
        let camp = new Camp({
            name: req.body.name,
            admin: admin,
            users:[admin]
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
        if (!req.body.username){
            res.json({success:false,message:'No username provided'});
        }
        else if(!req.body.password){
            res.json({success:false,message:'No password provided'});
        }
        else{
            Camp.findOne({users:{$elemMatch:{username:req.body.username.toLowerCase()}}}, (err,camp)=>{
                if(err){
                    res.json({success:false,message:err.message});
                }
                else if(!camp){
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
                    const validPassword = camp.users[0].comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({success:false,message:"Password is not valid"});
                    }
                    else{
                        const token = jwt.sign({userId:camp.users[0]._id}, config.secret,{ expiresIn:'100d'});
                        if(camp.users[0]._id.equals(camp.admin._id)){
                            res.json({success:true,message:"Success",token:token, user:{username:camp.users[0].username,permissions:"admin"}});
                        }
                        else{
                            res.json({success:true,message:"Success",token:token, user:{username:camp.users[0].username,permissions:"user"}});
                        }
                        
                    }
                }
            });
        }
    });

    // router.use((req,res,next)=>{
    //    const token = req.headers['authorization'];
    //    if(!token){
    //        res.json({success:false,message:'No token provided'});
    //    }
    //    else{
    //        jwt.verify(token,config.secret,(err,decoded)=>{
    //             if(err){
    //                 res.json({succes:false,message:"Token invalid. "+err});
    //             }
    //             else{
    //                 req.decoded = decoded;
    //                 next();
    //             }
    //        });
    //    }
    // });

    router.get('/dashboard', (req,res)=>{
        Camp.findOne({users:{$elemMatch:{_id:req.decoded.userId}}}, (err,camp)=>{
            if(err){
                res.json({success:false,message:err});
            }else if(!camp){
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
                res.json({success:true,user:camp.users[0]});
            }
        });
    });

    return router;
}