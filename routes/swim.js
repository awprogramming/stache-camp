const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const mongoose = require('mongoose');

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
            for(let group of camp.swimGroups){
                if(group.sessionId == camp.options.session._id){
                    var lifeguard = camp.counselors.id(group.lifeguardId);
                    g = {
                        data:group,
                        lifeguard:lifeguard
                    }
                    result.push(g);
                }
            }
            res.json({success:true,groups:result});
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

    router.post('/check_skill/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var skill = camp.campers.id(req.body.camperId).cSwimOpts.currentLevel.animals.id(req.body.animalId).skills.id(req.body.skillId);
            skill.completed = req.body.checked;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/level_complete/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var skill = camp.campers.id(req.body.camperId).cSwimOpts.currentLevel.animals.id(req.body.animalId).skills.id(req.body.skillId);
            skill.completed = req.body.checked;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });



    return router;
}