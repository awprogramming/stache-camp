const User = require('../models/user');
const SuperUser = require('../models/superUser');
const Camp = require('../models/camp');
const Camper = require('../models/camper');
const SwimGroup = require('../models/swimGroup');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const mongoose = require('mongoose');

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
            admin: admin._id,
            options:{
                counselor_types:[
                    {
                        type: "general counselor"
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
                    },
                    {
                        type:"admin"
                    }

                ]
            }
        });

        camp.save((err) =>{
            if (err) {
                if(err.code === 11000){
                    res.json({
                        success:false,
                        message: "Camp already exists"
                    });
                }
                else if(err.errors){
                    if(err.errors.name){
                        res.json({
                            success:false,
                            message: "Camp name required"
                        });
                    }
                }
            }
        }).then(()=>{
                    admin.save((err)=>{
                    if(err){
                        if(err.code === 11000){
                            res.json({
                                success:false,
                                message: "Username or email already exists"
                            });
                        }
                        else if(err.errors){
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
                    else{
                        res.json({
                            success:true,
                            message: "Account Registered!"
                        });
                    }
                }); 
            });
    });
    
    router.post('/login',(req,res)=>{
        if (!req.body.email){
            res.json({success:false,message:'No username provided'});
        }
        else if(!req.body.password){
            res.json({success:false,message:'No password provided'});
        }
        else{
            User.findOne({email:req.body.email.toLowerCase()}, (err,user)=>{
                if(err){
                    res.json({success:false,message:err.message});
                }
                else if(!user){
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
                    User.findOne({email:req.body.email.toLowerCase()}, (err,user)=>{

                        const validPassword = user.comparePassword(req.body.password);
                        if(!validPassword){
                            res.json({success:false,message:"Password is not valid"});
                        }
                        else{
                            user = user.toObject();
                            Camp.findById(user.camp_id,(err,camp)=>{
                            admin = camp.admin;
                            const token = jwt.sign({userId:user._id,campId:user.camp_id}, config.secret,{ expiresIn:'100d'});
                            if(user._id.equals(admin)||(user.type && user.type.type == "admin")){
                                res.json({success:true,message:"Success",token:token, user:{_id:user._id,type:{type:"leader"},email:user.email,permissions:"admin",camp_id:camp._id,modules:camp.modules}});
                            }
                            else{
                                res.json({success:true,message:"Success",token:token, user:{_id:user._id,type:user.type,email:user.email,permissions:"user",camp_id:camp._id,modules:camp.modules}});
                            }
                        });
                        }
                    });
                }
            });
        }
    });

    router.get('/get_swim_group/:groupId/:camperId', async function(req,res) {
        console.log(req.params.groupId);
        const group = await SwimGroup.aggregate([
            {
                $match:{_id:mongoose.Types.ObjectId(req.params.groupId)}
            },
            { $lookup:{
                from: "counselors",
                localField: "lifeguard_id",
                foreignField: "_id",
                as: "lifeguard"
                }
            },
            { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
        ]);

        const camper = await Camper.aggregate([
            {
                $match:{_id:req.params.camperId}
            },
            { $addFields: {
                "convertedId": { $toObjectId: "$division_id" }
            }},
            { $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            ]);
        console.log(group,camper);
        var result = {
            data:group[0],
            camper:camper[0]
        }
        res.json({success:true,group:result});
        // Camp.findById(req.params.campId, (err,camp)=>{
        //     var data = camp.swimGroups.id(req.params.id);
        //     var lifeguard = camp.counselors.id(data.lifeguardId);
        //     var campers = [];
        //     for(let camperId of data.camperIds){
        //         campers.push(camp.campers.id(camperId));
        //     }
        //     var result = {
        //         data:data,
        //         lifeguard:lifeguard,
        //         campers:campers
        //     }
        //     res.json({success:true,group:result});
        // });
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
          res.json({ success: false, message: 'No token provided' });
        } else {
          jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
              res.json({ success: false, message: 'Token invalid: ' + err });
            } else {
              req.decoded = decoded; 
              next(); 
            }
          });
        }
      });

    
    router.post('/change_password',(req,res)=>{
        var u;
        if(req.body.user_id == -1)
            u = req.decoded.userId;
        else
            u = req.body.user_id;
        User.findById(u).exec().then((user)=>{
            user.password = req.body.password;
            user.save({ validateBeforeSave: false },(err) =>{
                if (err) {
                    if(err.errors){
                        res.json({
                            success:false,
                            message: err.errors
                        });
                    }
                    else{
                        res.json({
                            success:false,
                            message: "Could not save user. Error: " + err
                        });
                    }
                }
                else{
                    res.json({
                        success:true,
                        message: "Password Changed"
                    });
                }
                })
        });
        });


    return router;
}