const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

module.exports = (router) => {
    router.get('/all_camps',(req,res) =>{
        Camp.find({},(err,camps) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!camps){
                    res.json({success:false, message:'No camp registered'})
                }
                else{
                   res.json({success:true,camps:camps});
                }
            }
        }).sort({'name':1})
    });

    /* COUNSELOR ROUTES */

    router.get('/all_counselors',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!camp.counselors || camp.counselors.length == 0){
                    res.json({success:false, message:'No Counselors registered'})
                }
                else{
                   res.json({success:true,counselors:camp.counselors});
                }
            }
        });
    });

    router.post('/add_counselor',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{counselors:req.body}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.delete('/remove_counselor/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {

            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{counselors:{_id:req.params.id}}},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Counselor deleted!' }); 
                }
            });
        }
      });

    /* DIVISION ROUTES */

    router.get('/all_divisions',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!camp.divisions || camp.divisions.length == 0){
                    res.json({success:false, message:'No divisions registered'})
                }
                else{
                   res.json({success:true,divisions:camp.divisions});
                }
            }
        });
    });

    router.post('/register_division',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{divisions:{name:req.body.name}}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.delete('/remove_division/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {

            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{divisions:{_id:req.params.id}}},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'division deleted!' }); 
                }
            });
        }
      });

      router.post('/add_division_counselor',(req,res) => {
        Camp.update({_id:req.decoded.campId,counselors:{$elemMatch:{_id:req.body._id}}},{$set:{"counselors.$.division":req.body.toAdd}}, (err,counselor)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    
    /* MODULE ROUTES */

    router.post('/activate_module',(req,res) =>{
        Camp.update({"_id":req.body._id},{$push:{modules:req.body.toAdd}}, (err)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    /* HEAD STAFF ROUTES */

    router.post('/register_head_staff', (req,res) => {
        let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
        });
        bcrypt.hash(user.password,null,null,(err,hash) => {
            user.password = hash;
            Camp.update({_id:req.decoded.campId},{$push:{users:user}},(err)=>{
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
            });
        });
    });

    router.get('/all_heads',(req,res) =>{
        console.log(req.decoded.campId);
        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$divisions'},
            { $project: {divisions:1}},
            { $unwind: '$divisions.leaders'},
            { $group : { _id : {_id:"$divisions.leaders._id",username:'$divisions.leaders.username',email:'$divisions.leaders.email'}, divisions:{$addToSet:"$divisions"}}}
        ],(err,result)=>{
            res.json({success:true,heads:result});
        });
    });

    router.delete('/remove_head/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{users:{_id:req.params.id}}},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Head staff member deleted!' }); 
                }
            });
        }
      });

      router.post('/add_division_head',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:toAdd._id}}},{$push:{"divisions.$.leaders":req.body}}, (err,head)=>{
            console.log(head);
            console.log(err);
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });
    
    return router;
}