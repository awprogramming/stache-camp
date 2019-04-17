const Camp = require('../models/camp');
const Division = require('../models/division');
const Specialty = require('../models/specialty');
const User = require('../models/user');
const Roster = require('../models/roster');
const CampEvent = require('../models/event');
const config = require('../config/database');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
ObjectID = require('mongodb').ObjectID;

module.exports = (router) => {

    router.post('/schedule_event',async function(req,res){
        if(req.body.type=="full-camp"){
            const divisions = await Division.aggregate([
                {$match:{camp_id:req.decoded.campId.toString()}},
                {$project:{
                    _id:{$toString:"$_id"}
                }}
            ])
            req.body.division_ids = divisions;
        }

        const event = await CampEvent.create(req.body);
        res.send({success:true,event:event});
    });

    router.post('/edit_event',async function(req,res){
        if(req.body.type =="game"){
            CampEvent.update(
                {_id:req.body._id},
                {name: req.body.name,
                notes:req.body.notes,
                tbd: req.body.tbd,
                location: req.body.location,
                opponent: req.body.opponent,
                date: req.body.date,
                needsLunch: req.body.needsLunch},(err)=>{
                    res.send({success:true});
                });
        }
        else if(req.body.type=="trip"){
            CampEvent.update(
                {_id:req.body._id},
                {name: req.body.name,
                notes:req.body.notes,
                tbd: req.body.tbd,
                location: req.body.location,
                date: req.body.date},(err)=>{
                    res.send({success:true});
                });
        }
        else{
            CampEvent.update(
                {_id:req.body._id},
                {name: req.body.name,
                notes:req.body.notes,
                tbd: req.body.tbd,
                date: req.body.date},(err)=>{
                    res.send({success:true});
                });
        }
    });

    router.post('/remove_event',(req,res) => {
        CampEvent.remove({_id:req.body.eventId},(err)=>{
            res.send({success:true});
        })
    });

    router.get('/get_month_events/:month/:year/:type',(req,res) => {
        if(req.params.type == "admin"){
            CampEvent.aggregate([
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
            { $unwind:{path:"$division_ids",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$division_ids" }
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
                $group:{
                    _id:{
                        _id:"$_id",
                        name:"$name",
                        date:"$date",
                        tbd:"$tbd",
                        notes:"$notes",
                        location:"$location",
                        type:"$type",
                        needsLunch:"$needsLunch",
                        type:"$type",
                        specialty:"$specialty",
                        roster_id:"$roster_id"
                    },
                    divisions:{
                        $push:"$division"
                    }
                }
            },
            {
                $project:{
                    _id:"$_id._id",
                    date:"$_id.date",
                    tbd:"$_id.tbd",
                    notes:"$_id.notes",
                    name:"$_id.name",
                    location:"$_id.location",
                    opponent:"$_id.opponent",
                    type:"$_id.type",
                    needsLunch:"$_id.needsLunch",
                    type:"$_id.type",
                    specialty:"$_id.specialty",
                    divisions:"$divisions",
                    roster_id:"$_id.roster_id"
                }
            },
            { $group:{
                _id:"$type",
                events:{$push:"$$ROOT"}
            }}


            ],(err,result)=>{
                res.send({success:true,events:result});
            });
        }
        else if(req.params.type == "head_specialist"){
            CampEvent.aggregate([
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
                            $and:[
                                {$ifNull:["$specialty.head_specialist_ids",false]},
                                {$in: [ req.decoded.userId.toString(),"$specialty.head_specialist_ids"]},
                            ]
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
                { $unwind:{path:"$division_ids",preserveNullAndEmptyArrays: true}},
                { $addFields: {
                    "convertedId": { $toObjectId: "$division_ids" }
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
                    $group:{
                        _id:{
                            _id:"$_id",
                            name:"$name",
                            date:"$date",
                            tbd:"$tbd",
                            notes:"$notes",
                            location:"$location",
                            opponent:"$opponent",
                            type:"$type",
                            needsLunch:"$needsLunch",
                            type:"$type",
                            specialty:"$specialty",
                            roster_id:"$roster_id"
                        },
                        divisions:{
                            $push:"$division"
                        }
                    }
                },
                {
                    $project:{
                        _id:"$_id._id",
                        date:"$_id.date",
                        name:"$_id.name",
                        tbd:"$_id.tbd",
                        notes:"$_id.notes",
                        location:"$_id.location",
                        opponent:"$_id.opponent",
                        type:"$_id.type",
                        needsLunch:"$_id.needsLunch",
                        type:"$_id.type",
                        specialty:"$_id.specialty",
                        divisions:"$divisions",
                        roster_id:"$_id.roster_id"
                    }
                },
                // { $addFields: {
                //     "convertedId": { $toObjectId: "$roster_id" }
                // }
                // },
                // { $lookup:{
                //     from: "rosters",
                //     localField: "convertedId",
                //     foreignField: "_id",
                //     as: "roster"
                //     }
                // },
                // { $unwind:{path:"$roster",preserveNullAndEmptyArrays: true}},
                { $group:{
                    _id:"$type",
                    events:{$push:"$$ROOT"}
                }}
                ],(err,result)=>{
                    console.log(err,result);
                    res.send({success:true,events:result});
            })
        }
        else{
            //DONT FORGET TO ADD IN THE CAMPERS FROM
            //OTHER ROSTERS WHO ARE NOT IN A DIVISION
            //ASSIGNED GAME
            CampEvent.aggregate([
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
                { $unwind:{path:"$division_ids",preserveNullAndEmptyArrays: true}},
                { $addFields: {
                    "convertedId": { $toObjectId: "$division_ids" }
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
                {
                    $group:{
                        _id:{
                            _id:"$_id",
                            name:"$name",
                            date:"$date",
                            tbd:"$tbd",
                            notes:"$notes",
                            location:"$location",
                            opponent:"$opponent",
                            type:"$type",
                            needsLunch:"$needsLunch",
                            type:"$type",
                            specialty:"$specialty",
                            roster_id:"$roster_id"
                        },
                        divisions:{
                            $push:"$division"
                        }
                    }
                },
                {
                    $project:{
                        _id:"$_id._id",
                        date:"$_id.date",
                        name:"$_id.name",
                        tbd:"$_id.tbd",
                        notes:"$_id.notes",
                        location:"$_id.location",
                        opponent:"$_id.opponent",
                        type:"$_id.type",
                        needsLunch:"$_id.needsLunch",
                        type:"$_id.type",
                        specialty:"$_id.specialty",
                        divisions:"$divisions",
                        roster_id:"$_id.roster_id"
                    }
                },
                { $group:{
                    _id:"$type",
                    events:{$push:"$$ROOT"}
                }}
    
    
                ],(err,result)=>{
                    console.log(result);
                    res.send({success:true,events:result});
            })
        }
        

        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$events'},
        //     { $project: {events:1}},
        //     { $sort: {'events.date':1}},
        // ]).exec().then((eventsList)=>{
        //     var events = [];
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         for(let event of eventsList){
        //             if(event.events.date.getMonth() == req.params.month && event.events.date.getFullYear() == req.params.year){
        //                 if(req.params.type == "admin"){
        //                     if(event.events.divisionId)
        //                         event.events.division = camp.divisions.id(event.events.divisionId);
        //                     events.push(event.events);  
        //                 }
        //                 else if(req.params.type == "head_specialist"){
        //                     var specialty = camp.specialties.id(event.events.specialty._id);
        //                     for(let hs of specialty.head_specialists){
        //                         if(hs._id == req.decoded.userId){
        //                             if(event.events.divisionId)
        //                                 event.events.division = camp.divisions.id(event.events.divisionId);
        //                             events.push(event.events);
        //                             break;
        //                         }
        //                     }   
        //                 } 
        //                 else if(req.params.type == "leader"){
        //                     if(event.events.divisionId){
        //                         event.events.division = camp.divisions.id(event.events.divisionId);
        //                         var pushed = false;
        //                         for(let leader of event.events.division.leaders){
        //                             console.log("TEST");
        //                             console.log(leader._id,req.decoded.userId);
        //                             if(leader._id == req.decoded.userId){
        //                                 events.push(event.events);
        //                                 pushed = true;
        //                                 break;
        //                             }
        //                         }
        //                         if(!pushed){
        //                             for(let approver of event.events.division.approvers){
        //                                 if(approver._id == req.decoded.userId){
        //                                     events.push(event.events);
        //                                     pushed = true;
        //                                     break;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                     else if(event.events.rosterId){
        //                         var roster = camp.specialties.id(event.events.specialty._id).rosters.id(event.events.rosterId);
        //                         for(let camper of roster.campers){
        //                             var pushed = false;
        //                             division = camp.divisions.id(camp.campers.id(camper).division._id);
        //                             for(let leader of division.leaders){
        //                                 if(leader._id == req.decoded.userId){
        //                                     if(event.events.divisionId)
        //                                         event.events.division = camp.divisions.id(event.events.divisionId);
        //                                     events.push(event.events);
                                        
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
        //         res.send({success:true,events:events});
        //     })
        // })
    });

    router.get('/get_division_month_events/:month/:year/:divisionId',async function(req,res) {
        const user = await User.findById(req.decoded.userId);
        const userType = user.type.type;
        console.log(req.params.divisionId);
        if(userType=="admin"){
            CampEvent.aggregate([
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
                            $in: [req.params.divisionId.toString(),"$division_ids"],
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
                { $unwind:{path:"$division_ids",preserveNullAndEmptyArrays: true}},
                { $addFields: {
                    "convertedId": { $toObjectId: "$division_ids" }
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
                    $group:{
                        _id:{
                            _id:"$_id",
                            name:"$name",
                            date:"$date",
                            tbd:"$tbd",
                            notes:"$notes",
                            location:"$location",
                            opponent:"$opponent",
                            type:"$type",
                            needsLunch:"$needsLunch",
                            type:"$type",
                            specialty:"$specialty",
                            roster_id:"$roster_id"
                        },
                        divisions:{
                            $push:"$division"
                        }
                    }
                },
                {
                    $project:{
                        _id:"$_id._id",
                        date:"$_id.date",
                        name:"$_id.name",
                        tbd:"$_id.tbd",
                        notes:"$_id.notes",
                        location:"$_id.location",
                        opponent:"$_id.opponent",
                        type:"$_id.type",
                        needsLunch:"$_id.needsLunch",
                        type:"$_id.type",
                        specialty:"$_id.specialty",
                        divisions:"$divisions",
                        roster_id:"$_id.roster_id"
                    }
                },
                { $group:{
                    _id:"$type",
                    events:{$push:"$$ROOT"}
                }}
                ],(err,result)=>{
                    console.log(result);
                    res.send({success:true,events:result});
                })
        }
        else{
            CampEvent.aggregate([
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
                            $and:[
                            {$in: [req.params.divisionId.toString(),"$division_ids"]},
                            {$in: [req.decoded.userId.toString(),"$specialty.head_specialist_ids"]}
                            ]
                        }, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
                { $unwind:{path:"$division_ids",preserveNullAndEmptyArrays: true}},
                { $addFields: {
                    "convertedId": { $toObjectId: "$division_ids" }
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
                    $group:{
                        _id:{
                            _id:"$_id",
                            name:"$name",
                            date:"$date",
                            tbd:"$tbd",
                            notes:"$notes",
                            location:"$location",
                            opponent:"$opponent",
                            type:"$type",
                            needsLunch:"$needsLunch",
                            type:"$type",
                            specialty:"$specialty",
                            roster_id:"$roster_id"
                        },
                        divisions:{
                            $push:"$division"
                        }
                    }
                },
                {
                    $project:{
                        _id:"$_id._id",
                        date:"$_id.date",
                        name:"$_id.name",
                        tbd:"$_id.tbd",
                        notes:"$_id.notes",
                        location:"$_id.location",
                        opponent:"$_id.opponent",
                        type:"$_id.type",
                        needsLunch:"$_id.needsLunch",
                        type:"$_id.type",
                        specialty:"$_id.specialty",
                        divisions:"$divisions",
                        roster_id:"$_id.roster_id"
                    }
                },
                { $group:{
                    _id:"$type",
                    events:{$push:"$$ROOT"}
                }}
                ],(err,result)=>{
                    console.log(result);
                    res.send({success:true,events:result});
                })
        }
        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$events'},
        //     { $project: {events:1}},
        //     { $sort: {'events.date':1}},
        // ]).exec().then((eventsList)=>{
        //     var events = [];
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         for(let event of eventsList){
        //             if(event.events.date.getMonth() == req.params.month && event.events.date.getFullYear() == req.params.year){
        //                 if(event.events.divisionId && event.events.divisionId == req.params.divisionId){
        //                     event.events.division = camp.divisions.id(event.events.divisionId);
        //                     events.push(event.events);
        //                 }
        //                 else if(event.events.rosterId){
        //                     var roster = camp.specialties.id(event.events.specialty._id).rosters.id(event.events.rosterId);
        //                     for(let camper of roster.campers){
        //                         var pushed = false;
                                
        //                         if(camp.campers.id(camper) && camp.campers.id(camper).division && camp.campers.id(camper).division._id == req.params.divisionId){
        //                             if(event.events.divisionId)
        //                                  event.events.division = camp.divisions.id(event.events.divisionId);
        //                             events.push(event.events);
        //                             pushed = true;
        //                             break;
        //                         }
        //                         if(pushed)
        //                             break;
        //                     }
        //                 } 
        //             }
        //         }
        //         res.send({success:true,events:events});
        //     })
        // })
    });

    router.get('/get_event/:id',(req,res) => {
        CampEvent.aggregate([
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
            { $unwind:{path:"$division_ids",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$division_ids" }
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
                $group:{
                    _id:{
                    _id:"$_id",
                    name:"$name",
                    date:"$date",
                    tbd:"$tbd",
                    notes:"$notes",
                    location:"$location",
                    opponent:"$opponent",
                    type:"$type",
                    needsLunch:"$needsLunch",
                    type:"$type",
                    specialty:"$specialty",
                    roster_id:"$roster_id",
                    coach_ids:"$coach_ids",
                    ref_ids:"$ref_ids"
                    },
                    divisions:{$push:"$division"}
                }
            },
            {
                $project:{
                    _id:"$_id._id",
                    date:"$_id.date",
                    name:"$_id.name",
                    tbd:"$_id.tbd",
                    notes:"$_id.notes",
                    location:"$_id.location",
                    opponent:"$_id.opponent",
                    type:"$_id.type",
                    needsLunch:"$_id.needsLunch",
                    type:"$_id.type",
                    specialty:"$_id.specialty",
                    roster_id:"$_id.roster_id",
                    coach_ids:"$_id.coach_ids",
                    ref_ids:"$_id.ref_ids",
                    divisions:"$divisions"
                }
            },
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
                        type: "$type",
                        tbd:"$tbd",
                        notes:"$notes",
                        location: "$location",
                        opponent: "$opponent",
                        needsLunch:"$needsLunch",
                        roster:{
                            _id:"$roster._id",
                            name:"$roster.name"
                        },
                        specialty:"$specialty",
                        divisions:"$divisions",
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
                        type: "$_id.type",
                        tbd:"$_id.tbd",
                        notes:"$_id.notes",
                        location:"$_id.location",
                        needsLunch:"$_id.needsLunch",
                        opponent:"$_id.opponent",
                        roster:"$_id.roster",
                        specialty:"$_id.specialty",
                        divisions:"$_id.divisions",
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
                        type: "$_id.type",
                        tbd:"$_id.tbd",
                        notes:"$_id.notes",
                        location: "$_id.location",
                        needsLunch:"$_id.needsLunch",
                        opponent: "$_id.opponent",
                        roster:"$_id.roster",
                        specialty:"$_id.specialty",
                        divisions:"$_id.divisions",
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
                    type: "$_id.type",
                    tbd:"$_id.tbd",
                    notes:"$_id.notes",
                    location:"$_id.location",
                    needsLunch:"$_id.needsLunch",
                    opponent:"$_id.opponent",
                    roster:"$_id.roster",
                    specialty:"$_id.specialty",
                    divisions:"$_id.divisions",
                    coaches:"$_id.coaches",
                    refs:"$refs",
                    
                }
            },


        ],(err,result)=>{
            res.send({success:true,event:result[0]});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.params.id);
        //     var campers = [];
        //     var coaches = [];
        //     var refs = [];
        //     var division = camp.divisions.id(event.divisionId);
        //     if(event.rosterId){
        //         event.roster = camp.specialties.id(event.specialty._id).rosters.id(event.rosterId);
                
        //         for(let camper of event.roster.campers){
        //             campers.push(camp.campers.id(camper));
        //         }
        //         event.roster.campers = campers;
        //     }
        //     if(event.coachIds){
        //         for(let counselor of event.coachIds){
        //             coaches.push(camp.counselors.id(counselor));
        //         }
        //     }
        //     if(event.refIds){
        //         for(let counselor of event.refIds){
        //             refs.push(camp.counselors.id(counselor));
        //         }
        //     }
        //     res.send({success:true,event:event,coaches:coaches,refs:refs,campers:campers,division:division});
        // });
    });

    router.post('/change_event_division',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{division_id:req.body.divisionId},(err)=>{
            res.send({success:true});
        })
    });

    router.post('/add_event_division',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$push:{division_ids:req.body.divisionId}},(err)=>{
            res.send({success:true});
        })
    });

    router.post('/remove_event_division',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$pull:{division_ids:req.body.divisionId}},(err)=>{
            res.send({success:true});
        })
    });

    router.post('/add_roster_to_event', async function(req,res){
        
        const division_ids = await Roster.aggregate([
            
            {$match:{_id:mongoose.Types.ObjectId(req.body.roster)}},
            { $unwind:{path:"$camper_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "campers",
                localField: "camper_ids",
                foreignField: "_id",
                as: "camper"
                }
            },
            { $unwind:{path:"$camper",preserveNullAndEmptyArrays: true}},
            {
                $group:{
                    _id:"$_id",
                    division_ids:{$addToSet:"$camper.division_id"}
                }
            }

        ]);
        CampEvent.update({_id:req.body.eventId},{roster_id:req.body.roster.toString(),division_ids:division_ids[0].division_ids},(err)=>{
            console.log(err)
            res.send({success:true});
        })
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.body.eventId);
        //     event.rosterId = req.body.roster;
        //     camp.save({ validateBeforeSave: false });
        //     event.roster = camp.specialties.id(event.specialty._id).rosters.id(event.rosterId);
        //     event.roster.camperObjs = []
        //     event.division = camp.divisions.id(event.divisionId);
        //     for(let camperId of event.roster.campers){
        //         var camper = camp.campers.id(camperId);
        //         camper.division = camp.divisions.id(camper.division._id);
        //         event.roster.camperObjs.push(camper);
        //     }
        //     rosterSubmittedEmail(event);
        //     res.send({success:true});
        // });
    });
    router.post('/remove_roster_from_event',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$unset:{roster_id:""}},(err)=>{
            console.log(err);
            res.send({success:true});
        })
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.body.eventId);
        //     event.rosterId = undefined;
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/add_coach_to_event',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$push:{coach_ids:req.body.coachId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.body.eventId);
        //     event.coachIds.push(req.body.coachId);
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/remove_coach_from_event',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$pull:{coach_ids:req.body.coachId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.body.eventId);
        //     for(var i = 0; i < event.coachIds.length; i++){
        //         if(event.coachIds[i] == req.body.coachId){
        //             event.coachIds.splice(i,1);
        //             break;
        //         }
        //     }
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/add_ref_to_event',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$push:{ref_ids:req.body.refId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.body.eventId);
        //     event.refIds.push(req.body.refId);
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    router.post('/remove_ref_from_event',(req,res)=>{
        CampEvent.update({_id:req.body.eventId},{$pull:{ref_ids:req.body.refId}},(err,result)=>{
            res.send({success:true});
        });
        // Camp.findById(req.decoded.campId,(err,camp)=>{
        //     var event = camp.events.id(req.body.eventId);
        //     for(var i = 0; i < event.refIds.length; i++){
        //         if(event.refIds[i] == req.body.refId){
        //             event.refIds.splice(i,1);
        //             break;
        //         }
        //     }
        //     camp.save({ validateBeforeSave: false });
        //     res.send({success:true});
        // });
    });

    return router;
}

// function eventScheduledEmail(event){
//     //SET LINKS PROPERLY
//     var text = "A event has been scheduled:\n";
//     text+= "http://evals.camptlc.com/event/"+event._id;
//     text+= event.name + "\n";
//     text+= "evals.camptlc.com/event/"+event._id;

//     var html = "<p>A event has been scheduled:</p>";
//     html+= "<p>"+event.name+"</p>";
//     html+= "<p>http://evals.camptlc.com/event/"+event._id+"</p>"

//     var emails = ['athletics@tylerhillcamp.com'];
//     if(event.division){
//         for(let leader of event.division.leaders){
//             emails.push(leader.email);
//         }
//         for(let leader of event.division.approvers){
//             emails.push(leader.email);
//         }
//     }

    
//     for(let email of emails){
//         let mailOptions = {
//             from: '"Tyler Hill Sports" <tylerhillsports@stachecamp.com>', // sender address
//             to: email, // list of receivers
//             subject: 'CampEvent Scheduled', // Subject line
//             text: text, // plain text body
//             html: html // html body
//         };
//         var message = "Email Sent To "+email;
//         sendEmail(mailOptions,message);
//     }


// }

function rosterSubmittedEmail(event){
    //SET LINKS PROPERLY
    var text = "A roster has been submitted:\n";
    // text+= "https://stachecamp.herokuapp.com/event/"+event._id;
    text+= event.name + "\n";
    text+= "localhost:4200/event/"+event._id;
    var html = "<p>A roster has been submitted:</p>";
    html+= "<p>"+event.name+"</p>";
    html+= "<p>http://evals.camptlc.com/event/"+event._id+"</p>"

    divisions = {}
    for(let camper of event.roster.camperObjs){

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