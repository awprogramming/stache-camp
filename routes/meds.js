const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const mongoose = require('mongoose');

module.exports = (router) => {
   
    router.post('/change_epi/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
           var camper = camp.campers.id(req.body.camper._id);
           if(!camper.meds){
            camper.meds = {
                epi:req.body.epi,
                inhaler:false,
                other:[]
            }
           }
           else
            camper.meds.epi = req.body.epi;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    router.post('/change_inh/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
           var camper = camp.campers.id(req.body.camper._id);
           if(!camper.meds){
            camper.meds = {
                epi:false,
                inhaler:req.body.inh,
                other:[]
            }
           }
           else
            camper.meds.inhaler = req.body.inh;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    router.post('/add_med/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
           var camper = camp.campers.id(req.body._id);

           if(!camper.meds){
                camper.meds = {
                    epi:false,
                    inhaler:false,
                    other:[]
                }
            }
            var med = {
                name: req.body.toAdd
            }
            var toAdd = camper.meds.other.create(med);
            camper.meds.other.push(toAdd);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    router.post('/remove_med/',(req,res) => {
        console.log("hello world");
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var camper = camp.campers.id(req.body.camper._id);
            camper.meds.other.pull(req.body.med._id);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    return router;
}