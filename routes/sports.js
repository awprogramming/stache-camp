const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const mongoose = require('mongoose');

module.exports = (router) => {
   
    router.post('/add_roster/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var specialty = camp.specialties.id(req.body.specialty._id);
            const roster = {
                name:req.body.name,
                campers:[]
            };
            specialty.rosters.create(roster);
            specialty.rosters.push(roster);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });

    });

    router.get('/all_rosters',(req,res) =>{
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var specialties = [];
            for(let specialty of camp.specialties){
                for(let hs of specialty.head_specialists){
                    if(req.decoded.userId==hs._id)
                        specialties.push(specialty)
                        break;
                }
            }
            res.send({success:true, specialties:specialties});
        });
    });

    router.delete('/remove_roster/:specialty/:roster', (req, res) => {
        Camp.update({_id:req.decoded.campId,specialties:{$elemMatch:{_id:req.params.specialty}}},{$pull:{"specialties.$.rosters":{_id:req.params.roster}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    return router;
}