const Camp = require('../models/camp');
const Division = require('../models/division');
const Specialty = require('../models/specialty');
const Roster = require('../models/roster');
const User = require('../models/user');
const Game = require('../models/game');
const config = require('../config/database');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
ObjectID = require('mongodb').ObjectID;

module.exports = (router) => {
   
    router.post('/add_roster/', async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        const roster = {
            name:req.body.name,
            camper_ids:[],
            specialty_id: req.body.specialty._id.toString(),
            session_id:camp.options.session._id.toString(),
            camp_id:camp._id.toString()
        };   
        var r = await Roster.create(roster);
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
            Specialty.update({_id:req.body.specialty._id},{$push:{roster_ids:r._id.toString()}},(err,specialty)=>{
                res.send({success:true});
            })
            
        }

    });

    router.get('/all_rosters', async function(req,res){
        const user = await User.findById(req.decoded.userId);
        var userType = user.type.type;
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        var specialties = [];
            if(userType == "admin"){
                specialties = await Specialty.aggregate([
                    {
                        $match:{camp_id:req.decoded.campId}
                    },
                    { $unwind:{path:"$roster_ids",preserveNullAndEmptyArrays: true}},
                    { $addFields: {
                        "convertedId": { $toObjectId: "$roster_ids" }
                    }
                    },
                    { $lookup:{
                        from: "rosters",
                        localField: "convertedId",
                        foreignField: "_id",
                        as: "roster"
                        }
                    },
                    { $unwind:{path:"$roster",preserveNullAndEmptyArrays: true}},
                    {
                        $group:{
                            _id:{
                                _id:"$_id",
                                name:"$name",
                            },
                            rosters:{$push:"$roster"}
                        }
                    },
                    {
                        $project:{
                            _id:"$_id._id",
                            name:"$_id.name",
                            rosters:"$rosters"
                        }
                    }
                ])
            }
            else{
                specialties = await Specialty.aggregate([
                    {
                        $match:{camp_id:req.decoded.campId}
                    },
                    {
                        $redact: {
                          $cond: {
                            if: {$in: [ req.decoded.userId.toString(),"$head_specialist_ids"]}, 
                            then: "$$KEEP",
                            else: "$$PRUNE"
                            },
                        }
                    },
                    { $unwind:{path:"$roster_ids",preserveNullAndEmptyArrays: true}},
                    { $addFields: {
                        "convertedId": { $toObjectId: "$roster_ids" }
                    }
                    },
                    { $lookup:{
                        from: "rosters",
                        localField: "convertedId",
                        foreignField: "_id",
                        as: "roster"
                        }
                    },
                    { $unwind:{path:"$roster",preserveNullAndEmptyArrays: true}},
                    {
                        $group:{
                            _id:{
                                _id:"$_id",
                                name:"$name",
                            },
                            rosters:{$push:"$roster"}
                        }
                    },
                    {
                        $project:{
                            _id:"$_id._id",
                            name:"$_id.name",
                            rosters:"$rosters"
                        }
                    }
                ])
            }
            console.log(specialties);
            res.send({success:true, curSession:curSession, specialties:specialties});
    });

    router.get('/specialty_rosters/:specialtyId',async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        console.log(req.params.specialtyId)
        const rosters = await Roster.find({specialty_id:req.params.specialtyId.toString(),session_id:curSession});
        console.log(rosters);
        res.send({success:true, rosters:rosters});
        // Camp.findById(req.decoded.campId, (err, camp)=>{

        //     var spec_rosters = camp.specialties.id(req.params.specialtyId).rosters;
        //     rosters = [];
        //     for(let roster of spec_rosters){
        //         if(roster.session._id.equals(camp.options.session._id))
        //             rosters.push(roster);
        //     }
        //     res.send({success:true, rosters:rosters});
        // });
    });

    router.delete('/remove_roster/:specialty/:roster', async function(req, res) {
        await Specialty.update({_id:req.params.specialty},{$pull:{roster_ids:req.params.roster}})
        await Roster.remove({_id:req.params.roster});
        res.json({success:true});
    });

    router.delete('/remove_internal_roster/:division/:roster', (req, res) => {
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.params.division}}},{$pull:{"divisions.$.rosters":{_id:req.params.roster}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.get('/get_roster/:specialtyId/:rosterId/',(req,res)=>{
        Roster.aggregate([
            {
                $match:{_id:mongoose.Types.ObjectId(req.params.rosterId)}
            },
            { $unwind:{path:"$camper_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "campers",
                localField: "camper_ids",
                foreignField: "_id",
                as: "camper"
                }
            },
            { $unwind:{path:"$camper",preserveNullAndEmptyArrays: true}},
            { $sort : { "camper.last" : 1} },
            {
                $group:{
                    _id:{
                        _id:"$_id",
                        name:"$name",
                    },
                    campers:{$push:"$camper"}
                }
            },
        ],(err,result)=>{
            res.json({roster:result[0]});
        })
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
        Roster.update({_id:req.body.r_id},{$push:{camper_ids:req.body.c_id.toString()}},(err,result)=>{
            res.send({success:true});
        })
    });

    router.post('/add_campers_to_roster',(req,res)=>{
        Roster.update({_id:req.body.r_id},{$push:{camper_ids: { $each: req.body.c_ids}}},(err,result)=>{
            res.send({success:true});
        })
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
        Roster.update({_id:req.body.r_id},{$pull:{camper_ids:req.body.c_id.toString()}},(err)=>{
            res.send({success:true});
        })
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

    router.get('/get_leader_rosters',async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        Roster.aggregate([
            {
                $match:{session_id:curSession}
            },
            { $unwind:{path:"$camper_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "campers",
                localField: "camper_ids",
                foreignField: "_id",
                as: "camper"
                }
            },
            { $unwind:"$camper"},
            { $addFields: {
                "camper.convertedId": { $toObjectId: "$camper.division_id" }
            }
            },
            { $lookup:{
                from: "divisions",
                localField: "camper.convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            { $unwind: "$division.leader_ids"},
            {
                $group:{
                    _id:{
                        _id:"$_id",
                        name:"$name",
                        specialty_id:"$specialty_id",
                        division:{
                            _id:"$division._id",
                            name:"$division.name"
                        }
                    },
                    leader_ids:{$push:"$division.leader_ids"}
                }
            },
            {
                $redact: {
                  $cond: {
                    if: {$in: [ req.decoded.userId.toString(),"$leader_ids"]}, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
            { $addFields: {
                "convertedId": { $toObjectId: "$_id.specialty_id" }
            }
            },
            { $lookup:{
                from: "specialties",
                localField: "convertedId",
                foreignField: "_id",
                as: "specialty"
                }
            },
            { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
            {
                $group:{
                    _id:{
                        specialty:"$specialty.name",
                        division:"$_id.division.name"
                    },
                    rosters:{$push:"$$ROOT"}
                }
            },
            {
                $group:{
                    _id:{
                        division:"$_id.division"
                    },
                    specialties:{$push:{
                        name:"$_id.specialty",
                        rosters:"$rosters"
                    }}
                }
            },

        ],(err,result)=>{
            console.log(result);
            res.send({success:true,divisions:result});
        })
    });

    router.post('/schedule_game',async function(req,res){
        const game = await Game.create(req.body);
        res.send({success:true,game:game});
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.create(req.body);
            
        //     camp.games.push(game);
        //     camp.save({ validateBeforeSave: false });
        //     if(game.divisionId)
        //         game.division = camp.divisions.id(game.divisionId)
        //     //gameScheduledEmail(game);
        //     res.send({success:true,game:game});
        // });
    });

    router.post('/remove_game',(req,res) => {
        Game.remove({_id:req.body.gameId},(err)=>{
            res.send({success:true});
        })
    });

    router.get('/get_month_games/:month/:year/:type',(req,res) => {
        if(req.params.type == "admin"){
            Game.aggregate([
            {
                $sort:{date:1}
            },
            {
                $addFields:{
                    month:{$month: "$date"},
                    year:{$year:"$date"}
                }
            },
            {
                $redact: {
                $cond: {
                    if: {
                        $and:[
                            {$eq: [ "$month", parseInt(req.params.month)+1 ]},
                            {$eq: [ "$year",parseInt(req.params.year)]}
                        ] 
                    }, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
            { $addFields: {
                "convertedId": { $toObjectId: "$specialty_id" }
            }
            },
            { $lookup:{
                from: "specialties",
                localField: "convertedId",
                foreignField: "_id",
                as: "specialty"
                }
            },
            { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$division_id" }
            }
            },
            { $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},


            ],(err,result)=>{

                res.send({success:true,games:result});
            });
        }
        else if(req.params.type == "head_specialist"){
            Game.aggregate([
                {
                    $sort:{date:1}
                },
                {
                    $addFields:{
                        month:{$month: "$date"},
                        year:{$year:"$date"}
                    }
                },
                {
                    $redact: {
                    $cond: {
                        if: {
                            $and:[
                                {$eq: [ "$month", parseInt(req.params.month)+1 ]},
                                {$eq: [ "$year",parseInt(req.params.year)]}
                            ] 
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
                { $addFields: {
                    "convertedId": { $toObjectId: "$specialty_id" }
                }
                },
                { $lookup:{
                    from: "specialties",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "specialty"
                    }
                },
                { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
                {
                    $redact: {
                    $cond: {
                        if: {
                            $in: [ req.decoded.userId.toString(),"$specialty.head_specialist_ids"],
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
                { $addFields: {
                    "convertedId": { $toObjectId: "$division_id" }
                }
                },
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                    }
                },
                { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
                { $addFields: {
                    "convertedId": { $toObjectId: "$roster_id" }
                }
                },
                { $lookup:{
                    from: "rosters",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "roster"
                    }
                },
                { $unwind:{path:"$roster",preserveNullAndEmptyArrays: true}},
    
    
                ],(err,result)=>{
    
                    res.send({success:true,games:result});
            })
        }
        else{
            //DONT FORGET TO ADD IN THE CAMPERS FROM
            //OTHER ROSTERS WHO ARE NOT IN A DIVISION
            //ASSIGNED GAME
            Game.aggregate([
                {
                    $sort:{date:1}
                },
                {
                    $addFields:{
                        month:{$month: "$date"},
                        year:{$year:"$date"}
                    }
                },
                {
                    $redact: {
                    $cond: {
                        if: {
                            $and:[
                                {$eq: [ "$month", parseInt(req.params.month)+1 ]},
                                {$eq: [ "$year",parseInt(req.params.year)]}
                            ] 
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
                { $addFields: {
                    "convertedId": { $toObjectId: "$specialty_id" }
                }
                },
                { $lookup:{
                    from: "specialties",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "specialty"
                    }
                },
                { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
                { $addFields: {
                    "convertedId": { $toObjectId: "$division_id" }
                }
                },
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                    }
                },
                { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
                {
                    $redact: {
                    $cond: {
                        if: {
                            $in: [ req.decoded.userId.toString(),"$division.leader_ids"],
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
    
    
                ],(err,result)=>{
                    res.send({success:true,games:result});
            })
        }
        

        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$games'},
        //     { $project: {games:1}},
        //     { $sort: {'games.date':1}},
        // ]).exec().then((gamesList)=>{
        //     var games = [];
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         for(let game of gamesList){
        //             if(game.games.date.getMonth() == req.params.month && game.games.date.getFullYear() == req.params.year){
        //                 if(req.params.type == "admin"){
        //                     if(game.games.divisionId)
        //                         game.games.division = camp.divisions.id(game.games.divisionId);
        //                     games.push(game.games);  
        //                 }
        //                 else if(req.params.type == "head_specialist"){
        //                     var specialty = camp.specialties.id(game.games.specialty._id);
        //                     for(let hs of specialty.head_specialists){
        //                         if(hs._id == req.decoded.userId){
        //                             if(game.games.divisionId)
        //                                 game.games.division = camp.divisions.id(game.games.divisionId);
        //                             games.push(game.games);
        //                             break;
        //                         }
        //                     }   
        //                 } 
        //                 else if(req.params.type == "leader"){
        //                     if(game.games.divisionId){
        //                         game.games.division = camp.divisions.id(game.games.divisionId);
        //                         var pushed = false;
        //                         for(let leader of game.games.division.leaders){
        //                             console.log("TEST");
        //                             console.log(leader._id,req.decoded.userId);
        //                             if(leader._id == req.decoded.userId){
        //                                 games.push(game.games);
        //                                 pushed = true;
        //                                 break;
        //                             }
        //                         }
        //                         if(!pushed){
        //                             for(let approver of game.games.division.approvers){
        //                                 if(approver._id == req.decoded.userId){
        //                                     games.push(game.games);
        //                                     pushed = true;
        //                                     break;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                     else if(game.games.rosterId){
        //                         var roster = camp.specialties.id(game.games.specialty._id).rosters.id(game.games.rosterId);
        //                         for(let camper of roster.campers){
        //                             var pushed = false;
        //                             division = camp.divisions.id(camp.campers.id(camper).division._id);
        //                             for(let leader of division.leaders){
        //                                 if(leader._id == req.decoded.userId){
        //                                     if(game.games.divisionId)
        //                                         game.games.division = camp.divisions.id(game.games.divisionId);
        //                                     games.push(game.games);
                                        
        //                                     pushed = true;
        //                                     break;
        //                                 } /* could be error location */
        //                             }
        //                             if(pushed)
        //                                 break;
        //                         }
        //                     }
        //                 }  
        //             }
        //         }
        //         res.send({success:true,games:games});
        //     })
        // })
    });

    router.get('/get_division_month_games/:month/:year/:divisionId',(req,res) => {
        Game.aggregate([
            {
                $sort:{date:1}
            },
            {
                $addFields:{
                    month:{$month: "$date"},
                    year:{$year:"$date"}
                }
            },
            {
                $redact: {
                $cond: {
                    if: {
                        $and:[
                            {$eq: [ "$month", parseInt(req.params.month)+1 ]},
                            {$eq: [ "$year",parseInt(req.params.year)]}
                        ] 
                    }, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
            { $addFields: {
                "convertedId": { $toObjectId: "$specialty_id" }
            }
            },
            { $lookup:{
                from: "specialties",
                localField: "convertedId",
                foreignField: "_id",
                as: "specialty"
                }
            },
            { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$division_id" }
            }
            },
            { $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toString: "$division._id" }
            }},
            {
                $redact: {
                $cond: {
                    if: {
                        $eq: ["$convertedId",req.params.divisionId],
                    }, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },


            ],(err,result)=>{
                res.send({success:true,games:result});
        })
        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$games'},
        //     { $project: {games:1}},
        //     { $sort: {'games.date':1}},
        // ]).exec().then((gamesList)=>{
        //     var games = [];
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         for(let game of gamesList){
        //             if(game.games.date.getMonth() == req.params.month && game.games.date.getFullYear() == req.params.year){
        //                 if(game.games.divisionId && game.games.divisionId == req.params.divisionId){
        //                     game.games.division = camp.divisions.id(game.games.divisionId);
        //                     games.push(game.games);
        //                 }
        //                 else if(game.games.rosterId){
        //                     var roster = camp.specialties.id(game.games.specialty._id).rosters.id(game.games.rosterId);
        //                     for(let camper of roster.campers){
        //                         var pushed = false;
                                
        //                         if(camp.campers.id(camper) && camp.campers.id(camper).division && camp.campers.id(camper).division._id == req.params.divisionId){
        //                             if(game.games.divisionId)
        //                                  game.games.division = camp.divisions.id(game.games.divisionId);
        //                             games.push(game.games);
        //                             pushed = true;
        //                             break;
        //                         }
        //                         if(pushed)
        //                             break;
        //                     }
        //                 } 
        //             }
        //         }
        //         res.send({success:true,games:games});
        //     })
        // })
    });

    router.get('/get_game/:id',(req,res) => {
        Game.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.params.id)}},
            { $addFields: {
                "convertedId": { $toObjectId: "$specialty_id" }
            }
            },
            { $lookup:{
                from: "specialties",
                localField: "convertedId",
                foreignField: "_id",
                as: "specialty"
                }
            },
            { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$division_id" }
            }
            },
            { $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$roster_id" }
            }
            },
            { $lookup:{
                from: "rosters",
                localField: "convertedId",
                foreignField: "_id",
                as: "roster"
                }
            },
            { $unwind:{path:"$roster",preserveNullAndEmptyArrays: true}},
            { $unwind:{path:"$roster.camper_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "campers",
                localField: "roster.camper_ids",
                foreignField: "_id",
                as: "camper"
                }
            },
            { $unwind:{path:"$camper",preserveNullAndEmptyArrays: true}},
            {
                $group:{
                    _id:{
                        _id:"$_id",
                        name: "$name",
                        date: "$date",
                        location: "$location",
                        opponent: "$opponent",
                        roster:{
                            _id:"$roster._id",
                            name:"$roster.name"
                        },
                        specialty:"$specialty",
                        division:"$division",
                        coach_ids:"$coach_ids",
                        ref_ids:"$ref_ids"
                    },
                    campers:{$push:"$camper"},
                }
            },
            { $addFields: {
                "_id.roster.campers": "$campers"
                }
            },
            { $unwind:{path:"$_id.coach_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "counselors",
                localField: "_id.coach_ids",
                foreignField: "_id",
                as: "coach"
                }
            },
            { $unwind:{path:"$coach",preserveNullAndEmptyArrays: true}},
            {
                $group:{
                    _id:{
                        _id:"$_id._id",
                        name:"$_id.name",
                        date:"$_id.date",
                        location:"$_id.location",
                        opponent:"$_id.opponent",
                        roster:"$_id.roster",
                        specialty:"$_id.specialty",
                        division:"$_id.division",
                        ref_ids:"$_id.ref_ids",
                    },
                    coaches:{$push:"$coach"},
                }
            },
            { $unwind:{path:"$_id.ref_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "counselors",
                localField: "_id.ref_ids",
                foreignField: "_id",
                as: "ref"
                }
            },
            { $unwind:{path:"$ref",preserveNullAndEmptyArrays: true}},
            {
                $group:{
                    _id:{
                        _id:"$_id._id",
                        name: "$_id.name",
                        date: "$_id.date",
                        location: "$_id.location",
                        opponent: "$_id.opponent",
                        roster:"$_id.roster",
                        specialty:"$_id.specialty",
                        division:"$_id.division",
                        coaches:"$coaches"
                    },
                    refs:{$push:"$ref"},
                }
            },
            {
                $project:{
                    _id:"$_id._id",
                    name:"$_id.name",
                    date:"$_id.date",
                    location:"$_id.location",
                    opponent:"$_id.opponent",
                    roster:"$_id.roster",
                    specialty:"$_id.specialty",
                    division:"$_id.division",
                    coaches:"$_id.coaches",
                    refs:"$refs",
                    
                }
            },


        ],(err,result)=>{
            res.send({success:true,game:result[0]});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.params.id);
        //     var campers = [];
        //     var coaches = [];
        //     var refs = [];
        //     var division = camp.divisions.id(game.divisionId);
        //     if(game.rosterId){
        //         game.roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
                
        //         for(let camper of game.roster.campers){
        //             campers.push(camp.campers.id(camper));
        //         }
        //         game.roster.campers = campers;
        //     }
        //     if(game.coachIds){
        //         for(let counselor of game.coachIds){
        //             coaches.push(camp.counselors.id(counselor));
        //         }
        //     }
        //     if(game.refIds){
        //         for(let counselor of game.refIds){
        //             refs.push(camp.counselors.id(counselor));
        //         }
        //     }
        //     res.send({success:true,game:game,coaches:coaches,refs:refs,campers:campers,division:division});
        // });
    });

    router.post('/change_game_division',(req,res)=>{
        Game.update({_id:req.body.gameId},{division_id:req.body.divisionId},(err)=>{
            res.send({success:true});
        })
    });

    router.post('/add_roster_to_game',(req,res)=>{
        Game.update({_id:req.body.gameId},{roster_id:req.body.roster.toString()},(err)=>{
            res.send({success:true});
        })
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.body.gameId);
        //     game.rosterId = req.body.roster;
        //     camp.save({ validateBeforeSave: false });
        //     game.roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
        //     game.roster.camperObjs = []
        //     game.division = camp.divisions.id(game.divisionId);
        //     for(let camperId of game.roster.campers){
        //         var camper = camp.campers.id(camperId);
        //         camper.division = camp.divisions.id(camper.division._id);
        //         game.roster.camperObjs.push(camper);
        //     }
        //     rosterSubmittedEmail(game);
        //     res.send({success:true});
        // });
    });
    router.post('/remove_roster_from_game',(req,res)=>{
        Game.update({_id:req.body.gameId},{$unset:{roster_id:""}},(err)=>{
            console.log(err);
            res.send({success:true});
        })
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.body.gameId);
        //     game.rosterId = undefined;
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/add_coach_to_game',(req,res)=>{
        Game.update({_id:req.body.gameId},{$push:{coach_ids:req.body.coachId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.body.gameId);
        //     game.coachIds.push(req.body.coachId);
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/remove_coach_from_game',(req,res)=>{
        Game.update({_id:req.body.gameId},{$pull:{coach_ids:req.body.coachId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.body.gameId);
        //     for(var i = 0; i < game.coachIds.length; i++){
        //         if(game.coachIds[i] == req.body.coachId){
        //             game.coachIds.splice(i,1);
        //             break;
        //         }
        //     }
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/add_ref_to_game',(req,res)=>{
        Game.update({_id:req.body.gameId},{$push:{ref_ids:req.body.refId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.body.gameId);
        //     game.refIds.push(req.body.refId);
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/remove_ref_from_game',(req,res)=>{
        Game.update({_id:req.body.gameId},{$pull:{ref_ids:req.body.refId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var game = camp.games.id(req.body.gameId);
        //     for(var i = 0; i < game.refIds.length; i++){
        //         if(game.refIds[i] == req.body.refId){
        //             game.refIds.splice(i,1);
        //             break;
        //         }
        //     }
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    return router;
}

// function gameScheduledEmail(game){
//     //SET LINKS PROPERLY
//     var text = "A game has been scheduled:\n";
//     text+= "http://evals.camptlc.com/game/"+game._id;
//     text+= game.name + "\n";
//     text+= "evals.camptlc.com/game/"+game._id;

//     var html = "<p>A game has been scheduled:</p>";
//     html+= "<p>"+game.name+"</p>";
//     html+= "<p>http://evals.camptlc.com/game/"+game._id+"</p>"

//     var emails = ['athletics@tylerhillcamp.com'];
//     if(game.division){
//         for(let leader of game.division.leaders){
//             emails.push(leader.email);
//         }
//         for(let leader of game.division.approvers){
//             emails.push(leader.email);
//         }
//     }

    
//     for(let email of emails){
//         let mailOptions = {
//             from: '"Tyler Hill Sports" <tylerhillsports@stachecamp.com>', // sender address
//             to: email, // list of receivers
//             subject: 'Game Scheduled', // Subject line
//             text: text, // plain text body
//             html: html // html body
//         };
//         var message = "Email Sent To "+email;
//         sendEmail(mailOptions,message);
//     }


// }

function rosterSubmittedEmail(game){
    //SET LINKS PROPERLY
    var text = "A roster has been submitted:\n";
    // text+= "https://stachecamp.herokuapp.com/game/"+game._id;
    text+= game.name + "\n";
    text+= "localhost:4200/game/"+game._id;
    var html = "<p>A roster has been submitted:</p>";
    html+= "<p>"+game.name+"</p>";
    html+= "<p>http://evals.camptlc.com/game/"+game._id+"</p>"

    divisions = {}
    for(let camper of game.roster.camperObjs){

        divisions[camper.division.name] = camper.division;
    }
    var emails = ['athletics@tylerhillcamp.com'];
    for(let division of Object.keys(divisions)){
        for(let leader of divisions[division].leaders)
            emails.push(leader.email);
        for(let leader of divisions[division].approvers)
            emails.push(leader.email);
    }

    //ADD HC EMAILS HERE
    //SET EMAILS PROPERLY!

    for(let email of emails){
        let mailOptions = {
            from: '"Tyler Hill Sports" <tylerhillsports@stachecamp.com>', // sender address
            to: email, // list of receivers
            subject: 'Roster Submitted', // Subject line
            text: text, // plain text body
            html: html // html body
        };
        var message = "Email Sent To "+email;
        sendEmail(mailOptions,message);
    }
}

function sendEmail(mailOptions,message){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'tylerhillsports@gmail.com',
               pass: 'THC!2018'
           }
       });
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(message);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

function displayDateTime(date){
    var d = new Date(date)
    var time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    var day = this.getDayName(d.getDay());
    var month = this.getMonthName(d.getMonth());
    return time + " on " + day+ ", " + month + " " + d.getDate();

}