const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const mongoose = require('mongoose');

module.exports = (router) => {
   
    router.post('/add_roster/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            if(req.body.internal){
                var division = camp.divisions.id(req.body.specialty);
                const roster = {
                    name:req.body.name,
                    campers:[],
                    session:camp.options.session
                };
                division.rosters.create(roster);
                division.rosters.push(roster);
                camp.save({ validateBeforeSave: false });
                res.send({success:true});
            }
            else{
                var specialty = camp.specialties.id(req.body.specialty._id);
                const roster = {
                    name:req.body.name,
                    campers:[],
                    session:camp.options.session
                };
                specialty.rosters.create(roster);
                specialty.rosters.push(roster);
                camp.save({ validateBeforeSave: false });
                res.send({success:true});
            }
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

    router.get('/specialty_rosters/:specialtyId',(req,res) =>{
        Camp.findById(req.decoded.campId, (err, camp)=>{

            var spec_rosters = camp.specialties.id(req.params.specialtyId).rosters;
            rosters = [];
            for(let roster of spec_rosters){
                if(roster.session._id.equals(camp.options.session._id))
                    rosters.push(roster);
            }
            res.send({success:true, rosters:rosters});
        });
    });

    router.delete('/remove_roster/:specialty/:roster', (req, res) => {
        Camp.update({_id:req.decoded.campId,specialties:{$elemMatch:{_id:req.params.specialty}}},{$pull:{"specialties.$.rosters":{_id:req.params.roster}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.delete('/remove_internal_roster/:division/:roster', (req, res) => {
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.params.division}}},{$pull:{"divisions.$.rosters":{_id:req.params.roster}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.get('/get_roster/:specialtyId/:rosterId/',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                roster = camp.specialties.id(req.params.specialtyId).rosters.id(req.params.rosterId);
                for(var i = 0; i < roster.campers.length; i++){
                    roster.campers[i] = camp.campers.id(roster.campers[i]);
                }
                res.json({success:true, roster:roster});
            }
        });
    });

    router.get('/get_internal_roster/:divisionId/:rosterId/',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                roster = camp.divisions.id(req.params.divisionId).rosters.id(req.params.rosterId);
                for(var i = 0; i < roster.campers.length; i++){
                    roster.campers[i] = camp.campers.id(roster.campers[i]);
                }
                res.json({success:true, roster:roster});
            }
        });
    });



    router.post('/add_camper_to_roster',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var roster = camp.specialties.id(req.body.sd_id).rosters.id(req.body.r_id);
            roster.campers.push(req.body.c_id);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/add_camper_to_internal_roster',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var roster = camp.divisions.id(req.body.sd_id).rosters.id(req.body.r_id);
            roster.campers.push(req.body.c_id);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/remove_camper_from_roster',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var roster = camp.specialties.id(req.body.sd_id).rosters.id(req.body.r_id);
            for(var i = 0; i < roster.campers.length; i++){
                if(roster.campers[i] == req.body.c_id){
                    roster.campers.splice(i,1);
                    break;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/remove_camper_from_internal_roster',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var roster = camp.divisions.id(req.body.sd_id).rosters.id(req.body.r_id);
            for(var i = 0; i < roster.campers.length; i++){
                if(roster.campers[i] == req.body.c_id){
                    roster.campers.splice(i,1);
                    break;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.get('/get_leader_rosters',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            const cur_sess = camp.options.session._id;
            const leader_id = req.decoded.userId;
            var rosters = {};
            for(let specialty of camp.specialties){
                for(let roster of specialty.rosters){
                    for(let camper of roster.campers){
                        camper = camp.campers.id(camper);
                        for(let leader of camper.division.leaders){
                            if(leader._id == leader_id){
                                if(rosters[camper.division.name]){
                                    if(rosters[camper.division.name]["specialties"][specialty.name])
                                        rosters[camper.division.name]["specialties"][specialty.name].push({ roster:roster,s_id:specialty._id});
                                    else
                                        rosters[camper.division.name]["specialties"][specialty.name] = { roster:roster,s_id:specialty._id};
                                }
                                else{
                                    rosters[camper.division.name] = {d_id:camper.division._id,specialties:{}};
                                    rosters[camper.division.name]["specialties"][specialty.name] = [{ roster:roster,s_id:specialty._id}];
                                }

                            }
                                
                        }
                    }
                }
            }
            for(let division of Object.keys(rosters)){
                rosters[division]["internal"] = camp.divisions.id(rosters[division].d_id).rosters;
            }
            res.send({success:true,rosters:rosters});
        });

        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$specialties'},
        //     { $project: {specialties:1}},
        //     { $unwind: '$specialties.rosters'},
        //     { $unwind: '$specialties.rosters.campers'},
        //     { $group : {
        //         _id : {s_id:"$specialties._id",s_name:"$specialties.name",sess_id:"$specialties.rosters.session._id",roster:"$specialties.rosters._id"}, 
        //         divisions:{$push:"$specialties.rosters.campers.division"}
        //         }
        //     },
        // ]).exec().then((result)=>{
        //         var rosters = {};
        //         for(let roster of result){ 
        //             for(let division of roster.divisions){
        //                 for(let leader of division.leaders){
        //                     if(leader._id == req.decoded.userId){
        //                         if(rosters[division.name]){
        //                             if(rosters[division.name]["specialties"][roster._id.s_name])
        //                             rosters[division.name]["specialties"][roster._id.s_name].push({ _id:roster._id.roster,s_id:roster._id.s_id});
        //                             else
        //                                 rosters[division.name]["specialties"][roster._id.s_name] = { _id:roster._id.roster,s_id:roster._id.s_id};
        //                         }
        //                         else{
        //                             rosters[division.name] = {d_id:division._id,specialties:{}};
        //                             rosters[division.name]["specialties"][roster._id.s_name] = [{ _id:roster._id.roster,s_id:roster._id.s_id}];
        //                         }
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        //     return rosters;
        // })
        // .then((rosters)=>{
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         if(err){
        //             res.json({success:false,message:err});
        //         }
        //         else{
        //             for(let division of Object.keys(rosters)){
        //                 for(let specialty of Object.keys(rosters[division])){
        //                     for(var i = 0; i < rosters[division]["specialties"][specialty].length; i++){
        //                         var s_id = rosters[division]["specialties"][specialty][i].s_id;
        //                         rosters[division]["specialties"][specialty][i] = {
        //                             roster:camp.specialties.id(rosters[division]["specialties"][specialty][i].s_id).rosters.id(rosters[division]["specialties"][specialty][i]._id),
        //                             s_id:rosters[division]["specialties"][specialty][i].s_id
        //                         };
        //                     }
        //                 }
        //             }
        //         }
        //         res.send({success:true,rosters:rosters});
        //     });
        // });
    });

    router.post('/schedule_game',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.create(req.body);
            camp.games.push(game);
            camp.save({ validateBeforeSave: false });
            res.send({success:true,game:game});
        });
    });

    router.get('/get_month_games/:month/:year/:type',(req,res) => {
        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$games'},
            { $project: {games:1}},
            { $sort: {'games.date':1}},
        ]).exec().then((gamesList)=>{
            var games = [];
            Camp.findById(req.decoded.campId,(err,camp)=>{
                for(let game of gamesList){
                    if(game.games.date.getMonth() == req.params.month && game.games.date.getFullYear() == req.params.year){
                        if(req.params.type == "admin")
                            games.push(game.games);  
                        else if(req.params.type == "Head Specialist"){
                            for(let hs of game.games.specialty.head_specialists){
                                if(hs._id == req.decoded.userId){
                                    games.push(game.games);
                                    break;
                                }
                            }   
                        } 
                        else if(req.params.type == "leader"){
                            if(game.games.rosterId){
                                var roster = camp.specialties.id(game.games.specialty._id).rosters.id(game.games.rosterId);
                                console.log(roster);
                                for(let camper of roster.campers){
                                    var pushed = false;
                                    division = camp.campers.id(camper).division;
                                    for(let leader of division.leaders){
                                        if(leader._id == req.decoded.userId)
                                            games.push(game.games);
                                            pushed = true;
                                            break;
                                    }
                                    if(pushed)
                                        break;
                                }
                            }
                        }  
                    }
                }
                res.send({success:true,games:games});
            })
        })
    });

    router.get('/get_game/:id',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.params.id);
            var campers = [];
            var coaches = [];
            var refs = [];
            if(game.rosterId){
                game.roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
                
                for(let camper of game.roster.campers){
                    campers.push(camp.campers.id(camper));
                }
                game.roster.campers = campers;
            }
            if(game.coachIds){
                for(let counselor of game.coachIds){
                    coaches.push(camp.counselors.id(counselor));
                }
            }
            if(game.refIds){
                for(let counselor of game.refIds){
                    refs.push(camp.counselors.id(counselor));
                }
            }
            res.send({success:true,game:game,coaches:coaches,refs:refs,campers:campers});
        });
    });

    router.post('/add_roster_to_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.rosterId = req.body.roster;
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });
    router.post('/remove_roster_from_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.rosterId = undefined;
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/add_coach_to_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.coachIds.push(req.body.coachId);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/remove_coach_from_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            for(var i = 0; i < game.coachIds.length; i++){
                if(game.coachIds[i] == req.body.coachId){
                    game.coachIds.splice(i,1);
                    break;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/add_ref_to_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.refIds.push(req.body.refId);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/remove_ref_from_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            for(var i = 0; i < game.refIds.length; i++){
                if(game.refIds[i] == req.body.refId){
                    game.refIds.splice(i,1);
                    break;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });


    return router;
}