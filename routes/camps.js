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

    router.get('/all_counselors/:permissions',(req,res) =>{
        if(req.params.permissions == "user"){
            // Camp.aggregate([
            //     {$match:{_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            //     {$unwind:"$counselors"},
            //     {$project:{counselors:1}},
            //     {$unwind:"$counselors.division.leaders"},
            //     {$match:{"counselors.division.$.leaders":{_id:mongoose.Types.ObjectId(req.decoded.userId)}}}
            //     //{$unwind:"$divisions.counselors"},
            //     //{$match:{divisions:{$elemMatch:{leaders:{_id:req.decoded.userId}}}}}
            // ],(err,result)=>{
            //     console.log(result);
            // });
        Camp.findById(req.decoded.campId).exec()
        .then(function(camp){
            var leaderDivisions = [];
            for(let division of camp.divisions){
                for(let leader of division.leaders){
                    if(leader._id == req.decoded.userId){
                        leaderDivisions.push(division._id);
                    }
                }
            }
            //res.json({success:true,counselors:leaderDivisions});
            var result = {
                "ld":leaderDivisions,
                "camp":camp
            }
            return result;
        })
        .then(function(result){
            var leaderDivisions = result.ld;
            var result = result.camp;
            var counselors = {};
            var ctr = 0;
            var finished = false;
            for(let counselor of result.counselors){
                for(let division of leaderDivisions){
                    if(counselor.division._id.equals(division)){
                        if(!(counselor.division.name in counselors))
                            counselors[counselor.division.name] = []
                        counselors[counselor.division.name].push(counselor);
                    }
                }
            }
            return counselors;
        })
        .then(function(counselors){
            res.json({success:true,counselors:counselors});
        });
        //Camp.findById(req.decoded.campId ,(err,result)=>{
            // function getCounselors(){
            //     var leaderDivisions = [];
            //     for(let division of result.divisions){
            //         for(let leader of division.leaders){
            //             if(leader._id == req.decoded.userId){
            //                 leaderDivisions.push(division._id);
            //             }
            //         }
            //     }
            //     var counselors = [];
            //     var ctr = 0;
            //     var finished = false;
            //     for(let counselor of result.counselors){
            //         ctr++;
            //         for(let division of leaderDivisions){
            //             if(counselor.division._id.equals(division)){
            //                 if(counselors[counselor.division.name] === undefined)
            //                     counselors[counselor.division.name] = []
            //                 counselors[counselor.division.name].push(counselor);
            //             }
            //         };
            //         if(ctr == result.counselors.length){
            //             console.log(ctr);
            //             finished = true;
            //         }
            //     }
            // }
            // if(finished){
            //     console.log(counselors);
            //     res.json({success:true,counselors:counselors});
            // }

            // // async function sendResults(){
            // //     var test = await getCounselors();
            // //     console.log(test);
            // //     res.json({success:true,counselors:test});
            // // }

            // getCounselors();
            // });
        }
        else{
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
        }
    });

    router.post('/add_counselor',(req,res) => {
        console.log(req.body);
        Camp.update({"_id":req.decoded.campId},{$push:{counselors:req.body}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.post('/bulk_add_counselor',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{counselors:{$each:req.body}}}, (err, camp)=>{
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

        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$divisions'},
            { $project: {divisions:1}},
            { $group : { _id : {gender:"$divisions.gender"}, divisions:{$push:"$divisions"}}},
            
        ],(err,result)=>{
            res.json({success:true,divisions:result});
        });
        // Camp.findOne({_id:req.decoded.campId},(err,camp) => {
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         if(!camp.divisions || camp.divisions.length == 0){
        //             res.json({success:false, message:'No divisions registered'})
        //         }
        //         else{
        //            res.json({success:true,divisions:camp.divisions});
        //         }
        //     }
        // });
    });

    router.post('/register_division',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{divisions:{$each:[{name:req.body.name,gender:'male'},{name:req.body.name,gender:'female'}]}}}, (err, camp)=>{
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
            password: req.body.password,
            first: req.body.first,
            last: req.body.last
        });
        bcrypt.hash(user.password,null,null,(err,hash) => {
            user.password = hash;
            Camp.update({_id:req.decoded.campId},{$push:{users:user}},(err)=>{
                if (err) {
                    if(err.code === 11000){
                        res.json({
                            success:false,
                            message: "Email already exists"
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
        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$divisions'},
        //     { $project: {divisions:1}},
        //     { $unwind: '$divisions.leaders'},
        //     { $group : { _id : {_id:"$divisions.leaders._id",username:'$divisions.leaders.username',email:'$divisions.leaders.email'}, divisions:{$addToSet:"$divisions"}}}
        // ],(err,result)=>{
        //     res.json({success:true,heads:result});
        // });

        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.users.length == 1){
                    res.json({success:false, message:'No head staff registered'})
                }
                else{
                   res.json({success:true,heads:camp.users.slice(1)});
                }
            }
        });

    });
    //
    router.delete('/remove_head/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findByIdAndUpdate(req.decoded.campId,{$pull:{users:{_id:req.params.id}}},{new:true},(err,camp)=>{
            //Camp.findById(req.decoded.campId,(err,camp)=>{
                camp.divisions.forEach((division)=>{
                    division.leaders.forEach((leader)=>{
                        leader.remove();
                    });
                });
                camp.save({ validateBeforeSave: false });
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    
                    res.json({ success: true, message: 'Head staff member deleted!' }); 
                }
            });
        }
      });

      router.post('/add_head_division',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body._id}}},{$push:{"divisions.$.leaders":toAdd}},(err,camp)=>{
            console.log(camp);
            res.json({success:true});
        });
        // Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body._id}}},{$push:{divisions:{leaders:req.body}}}, (err,head)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
    });

    router.post('/remove_head_division',(req,res) => {
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body.division_id}}},{$pull:{"divisions.$.leaders":{_id:req.body.leader_id}}},(err,camp)=>{
            console.log(camp);
            res.json({success:true});
        });
    });


    /* Specialties */

    router.post('/register_specialty',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{specialties:req.body}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.get('/all_specialties',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.specialties.length == 0){
                    res.json({success:false, message:'No specialties registered'})
                }
                else{
                res.json({success:true,specialties:camp.specialties});
                }
            }
        });
    });

    router.delete('/remove_specialty/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findByIdAndUpdate(req.decoded.campId,{$pull:{specialties:{_id:req.params.id}}},{new:true}).exec().then((camp) =>{
                camp.counselors.forEach((counselor)=>{
                    if(counselor.specialty && counselor.specialty._id.equals(req.params.id))
                        counselor.specialty.remove()
                })
                camp.save({ validateBeforeSave: false });
                return;
            }).then(()=>{
                res.json({ success: true, message: 'Specialty deleted!' }); 
            });
        }
      });

      router.post('/add_specialty_counselor',(req,res) => {
        Camp.update({_id:req.decoded.campId,counselors:{$elemMatch:{_id:req.body._id}}},{$set:{"counselors.$.specialty":req.body.toAddSpecialty}}, (err,counselor)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    /* options */

    router.get('/options',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true,options:camp.options});
            }
        });
    });

    router.post('/change_session',(req,res) =>{
        Camp.findById(req.decoded.campId).exec().then((camp)=>{
            const newSession = camp.sessions.create(req.body);
            camp.sessions.push(newSession);
            camp.options.session = newSession;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });
    
    return router;
}