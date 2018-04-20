const Camp = require('../models/camp');
const User = require('../models/user');
const Counselor = require('../models/counselor');
const config = require('../config/database');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

module.exports = (router) => {
   
    router.post('/register_group/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var group = camp.swimGroups.create(req.body);
            camp.swimGroups.push(group);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    router.post('/remove_swim_group/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            camp.swimGroups.pull(req.body.id);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.get('/all_groups',(req,res) => {
        Camp.findById(req.decoded.campId, (err,camp)=>{
            var result = [];
            var user = camp.users.id(req.decoded.userId);
            for(let group of camp.swimGroups){
                if(group.sessionId == camp.options.session._id){
                   var lifeguard = camp.counselors.id(group.lifeguardId);
                    g = {
                        data:group,
                        lifeguard:lifeguard
                    }
                    console.log(user.type);
                   if(user.type && user.type.type == "lifeguard"){
                        if(lifeguard._id == user.counselorRef){
                            result.push(g);
                        }
                   }
                   else{
                        result.push(g);
                    }
                }
            }
            res.json({success:true,groups:result});
        });
    });

    router.get('/in_groups',(req,res) => {
        Camp.findById(req.decoded.campId, (err,camp)=>{
            var result = [];
            for(let group of camp.swimGroups){
                if(group.sessionId == camp.options.session._id){
                    for(let camperId of group.camperIds){
                        var camper = camp.campers.id(camperId);
                        result.push(camper);
                    }
                }
            }
            res.json({success:true,campers:result});
        });
    });

    router.get('/get_swim_group/:id',(req,res) => {
        Camp.findById(req.decoded.campId, (err,camp)=>{
            var data = camp.swimGroups.id(req.params.id);
            var lifeguard = camp.counselors.id(data.lifeguardId);
            var campers = [];
            for(let camperId of data.camperIds){
                campers.push(camp.campers.id(camperId));
            }
            var result = {
                data:data,
                lifeguard:lifeguard,
                campers:campers
            }
            res.json({success:true,group:result});
        });
    });
    
    router.post('/add_to_swim_group/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            camp.swimGroups.id(req.body.groupId).camperIds.push(req.body.camperId);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/remove_from_swim_group/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            camp.swimGroups.id(req.body.groupId).camperIds.pull(req.body.camperId);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_level/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var level = camp.options.swimOpts.swimLevels.create(req.body);
            camp.options.swimOpts.swimLevels.push(level);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    router.post('/remove_swim_level/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            camp.options.swimOpts.swimLevels.pull(req.body.id);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.get('/all_levels',(req,res) => {
        Camp.findById(req.decoded.campId, (err,camp)=>{
            // camp.options.swimOpts = {
            //     swimLevels:[]
            // };
            // camp.save({ validateBeforeSave: false });
            res.json({success:true,levels:camp.options.swimOpts.swimLevels});
        });
    });

    router.get('/get_swim_level/:id',(req,res) => {
        Camp.findById(req.decoded.campId, (err,camp)=>{
            var data = camp.options.swimOpts.swimLevels.id(req.params.id);
            res.json({success:true,level:data});
        });
    });

    router.post('/set_swim_level/',(req,res) => {
        Camp.findById(req.decoded.campId, (err,camp)=>{
            camp.campers.id(req.body.camperId).cSwimOpts.currentLevel = req.body.level;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_swim_animal/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var animal = camp.options.swimOpts.swimLevels.id(req.body.id).animals.create(req.body.swimAnimal);
            camp.options.swimOpts.swimLevels.id(req.body.id).animals.push(animal);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_animal_skill/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var skill = camp.options.swimOpts.swimLevels.id(req.body.id).animals.id(req.body.swimAnimalId).skills.create({skill:req.body.skill});
            camp.options.swimOpts.swimLevels.id(req.body.id).animals.id(req.body.swimAnimalId).skills.push(skill);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_exit_skill/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var skill = camp.options.swimOpts.swimLevels.id(req.body.id).exitSkills.create({skill:req.body.skill});
            camp.options.swimOpts.swimLevels.id(req.body.id).exitSkills.push(skill);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/check_skill/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var skill = camp.campers.id(req.body.camperId).cSwimOpts.currentLevel.animals.id(req.body.animalId).skills.id(req.body.skillId);
            skill.completed = req.body.checked;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/check_exit_skill/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var skill = camp.campers.id(req.body.camperId).cSwimOpts.currentLevel.exitSkills.id(req.body.skillId);
            skill.completed = req.body.checked;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
            
        });
    });

    router.post('/level_complete/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var cSwimOpts = camp.campers.id(req.body.camperId).cSwimOpts;
            cSwimOpts.currentLevel.completed = true;
            cSwimOpts.currentLevel.sessionCompleted = camp.options.session;
            cSwimOpts.completedLevels.push(cSwimOpts.currentLevel);
            var level = cSwimOpts.currentLevel.rcLevel;
            for(let l of camp.options.swimOpts.swimLevels){
                if(l.rcLevel == level+1){
                   cSwimOpts.currentLevel = l;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_lifeguard', (req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
        var hst;
        for(let type of camp.options.headStaff_types){
            if(type.type == "lifeguard"){
                hst = type;
                break;
            }
        }
        var t;
        for(let type of camp.options.counselor_types){
            if(type.type == "specialist"){
                t = type;
                break;
            }
        }
        var s;
        for(let specialty of camp.specialties){
            if(specialty.name == "Lifeguard"){
                s = specialty;
                break;
            }
        }
        
        let counselor = new Counselor({
            first: req.body.first,
            last: req.body.last,
            gender:req.body.gender,
            type: t,
            specialty: s,
            sessions: [camp.options.session]
        })

        let user = new User({
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            first: req.body.first,
            last: req.body.last,
            type:hst,
            counselorRef:counselor._id
        });
        camp.counselors.push(counselor);
        camp.save({ validateBeforeSave: false });
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
    });




    return router;
}