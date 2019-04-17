const Camp = require('../models/camp');
const Camper = require('../models/camper');
const User = require('../models/user');
const config = require('../config/database');
const mongoose = require('mongoose');

module.exports = (router) => {
   
    router.post('/change_epi/',(req,res) => {
        Camper.findById(req.body.camper._id,(err,camper)=>{
            if(!camper.meds){
                camper.meds = {
                    epi:req.body.epi,
                    inhaler:false,
                    other:[]
                }
               }
               else
                camper.meds.epi = req.body.epi;
            camper.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //    var camper = camp.campers.id(req.body.camper._id);
        //    if(!camper.meds){
        //     camper.meds = {
        //         epi:req.body.epi,
        //         inhaler:false,
        //         other:[]
        //     }
        //    }
        //    else
        //     camper.meds.epi = req.body.epi;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/change_inh/',(req,res) => {
        Camper.findById(req.body.camper._id,(err,camper)=>{
            if(!camper.meds){
                camper.meds = {
                    epi:false,
                    inhaler:req.body.inh,
                    other:[]
                }
               }
               else
                camper.meds.inhaler = req.body.inh;
            camper.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //    var camper = camp.campers.id(req.body.camper._id);
        //    if(!camper.meds){
        //     camper.meds = {
        //         epi:false,
        //         inhaler:req.body.inh,
        //         other:[]
        //     }
        //    }
        //    else
        //     camper.meds.inhaler = req.body.inh;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/add_med/',(req,res) => {
        Camper.update({_id:req.body._id},{$push:{"meds.other":{name:req.body.toAdd}}},(err)=>{
            console.log(err);
            res.json({success:true});
        })
        // Camper.findById(req.body._id,(err,camper)=>{
        //     if(!camper.meds){
        //         camper.meds = {
        //             epi:false,
        //             inhaler:false,
        //             other:[]
        //         }
        //     }
        //     var med = {
        //         name: req.body.toAdd
        //     }
        //     var toAdd = camper.meds.other.create(med);
        //     camper.meds.other.push(toAdd);
        //     camper.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //    var camper = camp.campers.id(req.body._id);

        //    if(!camper.meds){
        //         camper.meds = {
        //             epi:false,
        //             inhaler:false,
        //             other:[]
        //         }
        //     }
        //     var med = {
        //         name: req.body.toAdd
        //     }
        //     var toAdd = camper.meds.other.create(med);
        //     camper.meds.other.push(toAdd);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/remove_med/',(req,res) => {
        Camper.update({_id:req.body.camper._id},{$pull:{"meds.other":{_id:req.body.med._id}}},(err)=>{
            console.log(err);
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var camper = camp.campers.id(req.body.camper._id);
        //     camper.meds.other.pull(req.body.med._id);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/add_allergy/',(req,res) => {
        Camper.update({_id:req.body._id},{$push:{"dietary.allergies":{name:req.body.toAddAllergy}}},(err)=>{
            console.log(err);
            res.json({success:true});
        })

    });

    router.post('/remove_allergy/',(req,res) => {
        Camper.update({_id:req.body.camper._id},{$pull:{"dietary.allergies":{_id:req.body.allergy._id}}},(err)=>{
            console.log(err);
            res.json({success:true});
        })
        // Camper.findById(req.decoded.camper._id, (err, camper)=>{
        //     camper.dietary.allergies.pull(req.body.allergy._id);
        //     camper.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/add_other_dietary/',(req,res) => {
        Camper.update({_id:req.body._id},{$push:{"dietary.other":{name:req.body.toAddOther}}},(err)=>{
            console.log(err);
            res.json({success:true});
        })
        // Camper.findById(req.body._id, (err, camper)=>{
        //    if(!camper.dietary){
        //         camper.dietary = {
        //             allergies:[],
        //             other:[]
        //         }
        //     }
        //     var otherDietary = {
        //         name: req.body.toAddOther
        //     }
        //     var toAdd = camper.dietary.other.create(otherDietary);
        //     camper.dietary.other.push(toAdd);
        //     camper.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/remove_other_dietary/',(req,res) => {
        Camper.update({_id:req.body.camper._id},{$pull:{"dietary.other":{_id:req.body.otherDietary._id}}},(err)=>{
            console.log(err);
            res.json({success:true});
        })
        // Camper.findById(req.body.camper._id, (err, camper)=>{
        //     camper.dietary.other.pull(req.body.otherDietary._id);
        //     camper.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    return router;
}