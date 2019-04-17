const Camp = require('../models/camp');
const Camper = require('../models/camper');
const Specialty = require('../models/specialty');
const User = require('../models/user');
const SwimGroup = require('../models/swimGroup');
const SwimLevel = require('../models/swimLevel');
const Counselor = require('../models/counselor');
const config = require('../config/database');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');

module.exports = (router) => {
   
    router.post('/register_group/',(req,res) => {
        req.body.camp_id = req.decoded.campId;
        SwimGroup.create(req.body,(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     console.log(req.body);
        //     var group = camp.swimGroups.create(req.body);
        //     camp.swimGroups.push(group);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/remove_swim_group/',(req,res) => {
        console.log(req.body.id);
        SwimGroup.remove({_id:req.body.id},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.pull(req.body.id);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/change_group_name/',(req,res) => {
        SwimGroup.update({_id:req.body.groupId},{name:req.body.newName},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.id(req.body.groupId).name = req.body.newName;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });
    router.get('/get_camper_group/:camperId',async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        SwimGroup.aggregate([
            { $unwind: '$camper_ids'},
            {
                $redact: {
                    $cond: {
                    if:{
                        $and:[
                            {$eq: [ "$session_id",curSession]},
                            {$eq: [ "$camper_ids",req.params.camperId]},
                        ]
                    }, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
        ],(err,result)=>{
            if(result.length > 0)
                res.json({success:true,group:result[0]});
            else
                res.json({success:false});
        })
        // Camp.findById(req.decoded.campId, (err,camp)=>{
        //     var camperGroup;
        //     for(let group of camp.swimGroups){
        //         var found = false;
        //         for(let camperId of group.camperIds){
        //             if(req.params.camperId == camperId){
        //                 found = true
        //                 break;
        //             }
        //         }
        //         if(found){
        //             camperGroup = group;
        //             break;
        //         }
        //     }
        //     if(camperGroup)
        //         res.json({success:true,group:camperGroup});
        //     else
        //         res.json({success:false});
        // });
    });
    

    // router.get('/all_groups',(req,res) => {
    //     Camp.findById(req.decoded.campId, (err,camp)=>{
    //         var result = [];
    //         var user = camp.users.id(req.decoded.userId);
    //         for(let group of camp.swimGroups){
    //             if(group.sessionId == camp.options.session._id){
    //                var lifeguard = camp.counselors.id(group.lifeguardId);
    //                 g = {
    //                     data:group,
    //                     lifeguard:lifeguard
    //                 }
    //                if(user.type && user.type.type == "lifeguard"){
    //                     if(lifeguard && lifeguard._id == user.counselorRef){
    //                         result.push(g);
    //                     }
    //                }
    //                else{
    //                     result.push(g);
    //                 }
    //             }  
    //         }
    //         res.json({success:true,groups:result});
    //     });
    // });

    router.get('/all_groups',async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        const user = await User.findById(req.decoded.userId);
        var userType = user.type.type;
        if(userType == "admin"){
            SwimGroup.aggregate([
                {
                    $match:{session_id:curSession}
                },
                { $lookup:{
                    from: "counselors",
                    localField: "lifeguard_id",
                    foreignField: "_id",
                    as: "lifeguard"
                    }
                },
                { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
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
                        _id: {
                            d_id:"$camper.division_id",
                            g_id:"$_id",
                            g_name:"$name",
                            lifeguard:"$lifeguard"
                        },
                        campers:{$push:"$camper"}
                    }
                },
                {
                    $group:{
                        _id: "$_id.d_id",
                        groups:{$push:{
                            _id:"$_id.g_id",
                            name:"$_id.g_name",
                            lifeguard:"$_id.lifeguard"
                        }}
                    }
                },
                { $addFields: {
                    "convertedId": { $toObjectId: "$_id" }
                }},
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                    }
                },
                { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            ],(err,groups)=>{
                res.json({success:true,groups:groups});
            })
        }
        else if(userType=="lifeguard"){
            SwimGroup.aggregate([
                {
                    $match:{session_id:curSession,lifeguard_id:user.counselorRef}
                },
                { $lookup:{
                    from: "counselors",
                    localField: "lifeguard_id",
                    foreignField: "_id",
                    as: "lifeguard"
                    }
                },
                { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
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
                        _id: {
                            d_id:"$camper.division_id",
                            g_id:"$_id",
                            g_name:"$name",
                            lifeguard:"$lifeguard"
                        },
                        campers:{$push:"$camper"}
                    }
                },
                {
                    $group:{
                        _id: "$_id.d_id",
                        groups:{$push:{
                            _id:"$_id.g_id",
                            name:"$_id.g_name",
                            lifeguard:"$_id.lifeguard"
                        }}
                    }
                },
                { $addFields: {
                    "convertedId": { $toObjectId: "$_id" }
                }},
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                    }
                },
                { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            ],(err,groups)=>{
                console.log(err);
                console.log(groups);
                res.json({success:true,groups:groups});
            })
        }
        else{
            SwimGroup.aggregate([
                {
                    $match:{session_id:curSession}
                },
                { $lookup:{
                    from: "counselors",
                    localField: "lifeguard_id",
                    foreignField: "_id",
                    as: "lifeguard"
                    }
                },
                { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
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
                        _id: {
                            d_id:"$camper.division_id",
                            g_id:"$_id",
                            g_name:"$name",
                            lifeguard:"$lifeguard"
                        },
                        campers:{$push:"$camper"}
                    }
                },
                {
                    $group:{
                        _id: "$_id.d_id",
                        groups:{$push:{
                            _id:"$_id.g_id",
                            name:"$_id.g_name",
                            lifeguard:"$_id.lifeguard"
                        }}
                    }
                },
                { $addFields: {
                    "convertedId": { $toObjectId: "$_id" }
                }},
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                    }
                },
                { $unwind:"$division"},
                {
                    $redact: {
                      $cond: {
                        if: {$in: [ req.decoded.userId.toString(),"$division.leader_ids"]}, 
                        then: "$$KEEP",
                        else: "$$PRUNE"
                        },
                    }
                },
            ],(err,groups)=>{
                console.log(err);
                console.log(groups);
                res.json({success:true,groups:groups});
            })
        }
        // Camp.findById(req.decoded.campId).exec().then((camp)=>{
        //     var result = {};
        //     var user = camp.users.id(req.decoded.userId);
        //     var count = 0;
        //     if(camp.swimGroups.length == 0){
        //         res.json({success:false});
        //     }
        //     else{
        //         for(let group of camp.swimGroups){
        //             count++;
        //             if(group.sessionId == camp.options.session._id){
        //             var lifeguard = camp.counselors.id(group.lifeguardId);
        //                 g = {
        //                     data:group,
        //                     lifeguard:lifeguard
        //                 }
        //             if(user.type && user.type.type == "lifeguard"){
        //                 //if(lifeguard)
        //                 //console.log(lifeguard._id,user.counselorRef);
        //                     if(lifeguard && lifeguard._id == user.counselorRef){
        //                         //console.log("hello world");
        //                         var divisions = [];
        //                         for(let id of group.camperIds){
        //                             var camper = camp.campers.id(id);
        //                             if(!divisions[camper.division.name]){
        //                                     if(result[camper.division.name])
        //                                         result[camper.division.name].push(g);
        //                                     else
        //                                         result[camper.division.name] = [g];
        //                             }
        //                             divisions[camper.division.name] = true;
        //                         }
        //                     }
        //             }
        //             else if(user.type && user.type.type == "leader"){
        //                 var divisions = [];
        //                 for(let id of group.camperIds){
        //                     var camper = camp.campers.id(id);
        //                     var div = camp.divisions.id(camper.division._id);
        //                     for(let leader of div.leaders){
        //                         if(String(leader._id) == String(user._id)){
        //                             if(!divisions[camper.division.name]){
        //                                 if(result[camper.division.name])
        //                                     result[camper.division.name].push(g);
        //                                 else
        //                                     result[camper.division.name] = [g];
        //                             }
        //                             divisions[camper.division.name] = true;
        //                             break;
        //                         }
        //                     }
        //                 }
        //             }
        //             else{
        //                 if(group.camperIds.length==0){
        //                     if(result["No Division"])
        //                         result["No Division"].push(g);
        //                     else
        //                         result["No Division"] = [g];
        //                 }
        //                 else{
        //                     var divisions = [];
        //                     for(let id of group.camperIds){
        //                         var camper = camp.campers.id(id);
        //                         if(!divisions[camper.division.name]){
        //                                 if(result[camper.division.name])
        //                                     result[camper.division.name].push(g);
        //                                 else
        //                                     result[camper.division.name] = [g];
        //                         }
        //                         divisions[camper.division.name] = true;
        //                     }
        //                 }
        //             }
        //             }  
        //         }
        //         res.json({success:true,groups:result});
        //     }
        // })
    });

    router.get('/prep_export',async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        SwimGroup.aggregate([
            {
                $match:{session_id:curSession}
            },
            { $lookup:{
                from: "counselors",
                localField: "lifeguard_id",
                foreignField: "_id",
                as: "lifeguard"
                }
            },
            { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
            { $unwind:{path:"$camper_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "campers",
                localField: "camper_ids",
                foreignField: "_id",
                as: "camper"
                }
            },
            { $unwind:{path:"$camper",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$camper.division_id" }
            }},
            { $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            {
                $project:{
                    _id:0,
                    first:"$camper.first",
                    last:"$camper.last",
                    group:"$division.name",
                    level:"$camper.cSwimOpts.currentLevel.rcLevel",
                    swimGroup:"$name",
                    instructor:{ $concat: [ "$lifeguard.first"," ","$lifeguard.last" ] },

                }
            }
        ],(err,campers)=>{
            res.json({success:true,campers:campers});
        })
    });

    router.get('/lifeguard_reports/:id',async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        SwimGroup.aggregate([
            {
                $match:{session_id:curSession}
            },
            {
                $redact: {
                $cond: {
                    if: {
                        $eq: [ "$lifeguard_id", req.params.id ] 
                    }, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
            { $lookup:{
                from: "counselors",
                localField: "lifeguard_id",
                foreignField: "_id",
                as: "lifeguard"
                }
            },
            { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
            { $unwind:{path:"$camper_ids",preserveNullAndEmptyArrays: true}},
            { $lookup:{
                from: "campers",
                localField: "camper_ids",
                foreignField: "_id",
                as: "camper"
                }
            },
            { $unwind:{path:"$camper",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                "convertedId": { $toObjectId: "$camper.division_id" }
            }},
            { $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
            {
                $project:{
                    _id:"$_id",
                    camper_id:"$camper._id",
                    first:"$camper.first",
                    last:"$camper.last",
                    group:"$division.name",
                    level:"$camper.cSwimOpts.currentLevel.rcLevel",
                    currentLevel:"$camper.cSwimOpts.currentLevel",
                    instructor:{ $concat: [ "$lifeguard.first"," ","$lifeguard.last" ] },

                }
            }
        ],(err,campers)=>{
            res.json({success:true,campers:campers});
        })
    });

    router.get('/in_groups',async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();

        SwimGroup.aggregate([
            {
                $match:{session_id:curSession}
            },
            {
                $unwind:"$camper_ids"
            },
            {
                $group:{
                    _id:"$session_id",
                    campers:{$push:"$camper_ids"}
                }
            }
        ],(err,campers)=>{
            res.json({success:true,campers:campers});
        })

        // Camp.findById(req.decoded.campId, (err,camp)=>{
        //     var result = [];
        //     for(let group of camp.swimGroups){
        //         if(group.sessionId == camp.options.session._id){
        //             for(let camperId of group.camperIds){
        //                 var camper = camp.campers.id(camperId);
        //                 result.push(camper);
        //             }
        //         }
        //     }
        //     res.json({success:true,campers:result});
        // });
    });

    router.get('/get_swim_group/:id',(req,res) => {
        SwimGroup.aggregate([
            {
                $match:{_id:mongoose.Types.ObjectId(req.params.id)}
            },
            { $lookup:{
                from: "counselors",
                localField: "lifeguard_id",
                foreignField: "_id",
                as: "lifeguard"
                }
            },
            { $unwind:{path:"$lifeguard",preserveNullAndEmptyArrays: true}},
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
            { $addFields: {
                "camper.convertedId": { $toObjectId: "$camper.division_id" }
            }},
            { $lookup:{
                from: "divisions",
                localField: "camper.convertedId",
                foreignField: "_id",
                as: "camper.division"
                }
            },
            { $unwind:{path:"$camper.division",preserveNullAndEmptyArrays: true}},
            {
                $group:{
                    _id: {
                        _id:"$_id",
                        name:"$name",
                        lifeguard:"$lifeguard"
                    },
                    campers:{$push:"$camper"}
                }
            },
            {
                $project:{
                    _id:"$_id._id",
                    name:"$_id.name",
                    lifeguard:"$_id.lifeguard",
                    campers:"$campers"
                }
            }


        ],(err,group)=>{
                res.json({success:true,group:group[0]});
            })
        // SwimGroup.findById(req.params.id,(err,group)=>{
        //     res.json({success:true,group:group[0]});
        // })
        // Camp.findById(req.decoded.campId, (err,camp)=>{
        //     var data = camp.swimGroups.id(req.params.id);
        //     var lifeguard = camp.counselors.id(data.lifeguardId);
        //     var campers = [];
        //     for(let camperId of data.camperIds){
        //         campers.push(camp.campers.id(camperId));
        //     }
        //     var result = {
        //         data:data,
        //         lifeguard:lifeguard,
        //         campers:campers
        //     }
        //     res.json({success:true,group:result});
        // });
    });

    router.post('/generate_groups/', async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        Camper.aggregate([
            {
                $redact: {
                    $cond: {
                    if: {$in: [ curSession,"$session_ids"]},
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
            {$addFields: {
                convertedId: { $toObjectId: "$division_id" }
            }
            },
            { 
                $lookup:{
                from: "divisions",
                localField: "convertedId",
                foreignField: "_id",
                as: "division"
                }
            },
            {
                $unwind:{path:"$division",preserveNullAndEmptyArrays: true}
            },
            {
                $group:{
                    _id: {d_id:"$division._id",d_name:"$division.name",d_gender:"$division.gender"},
                    campers:{$push:"$$ROOT"}
                }
            },
        ],(err,result)=>{
            const agMax = camp.options.swimOpts.agMax;
            var divs = []
            for(let division of result){
                if(division._id.d_id){
                    var div = {
                        _id:division._id.d_id,
                        name:division._id.d_name,
                        gender:division._id.d_gender.toLowerCase(),
                        campers:[]
                    };
                    for(let camper of division.campers){
                        if(camper.cSwimOpts.currentLevel){
                            if(div.campers["L"+camper.cSwimOpts.currentLevel.rcLevel])
                                div.campers["L"+camper.cSwimOpts.currentLevel.rcLevel].push(camper);
                            else
                                div.campers["L"+camper.cSwimOpts.currentLevel.rcLevel] = [camper];
                        }
                    }
                    divs.push(div);
                }
            }
            for(let division of divs){
                console.log(division)
                for(let level of Object.keys(division.campers)){
                    var groupCount = 0;
                    var gen = division.gender == "male" ? "boys":"girls";
                    
                    var name = division.name+" "+gen+" "+level+" #";
                    campers = [];
                    var camperCount = 0
                    for(let camper of division.campers[level]){
                        campers.push(camper._id.toString());
                        camperCount++;
                        if(camperCount == agMax){
                            groupCount++;
                            groupName = name+groupCount;
                            let newGroup =  new SwimGroup({
                                name:groupName,
                                camper_ids:campers,
                                session_id:curSession,
                                camp_id: camp._id.toString()
                            });
                            newGroup.save();
                            campers = [];
                        }
                    }
                    if(campers.length > 0){
                        groupCount++;
                        groupName = name+groupCount;
                        let newGroup =  new SwimGroup({
                            name:groupName,
                            camper_ids:campers,
                            session_id:curSession,
                            camp_id: camp._id.toString()
                        });
                        newGroup.save();
                        campers = [];
                    }
                }
            }
            res.json({success:true});    
        })

        // Camp.findById(req.decoded.campId).exec().then((camp)=>{
        //     const current_session = camp.options.session;
        //     Camp.aggregate([
        //         { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //         { $unwind: '$campers'},
        //         { $project: {campers:1}},
        //         { $unwind: '$campers.sessions'},
        //         { $group : {
        //             _id : {s_id:"$campers.sessions._id",d_id:"$campers.division._id",d_name:"$campers.divison.name"}, 
        //             campers:{$push:"$campers"}
        //             }
        //         },
        //         { $group : {
        //             _id : "$_id.s_id",
        //             divisions: {
        //                 $push:{
        //                     d_id: "$_id.d_id",
        //                     d_name: "$_id.d_name",
        //                     campers:"$campers"}
        //                 }
        //             } 
        //         },
        //     ],(err,result)=>{
        //         const agMax = camp.options.swimOpts.agMax;
        //         var sess_count = 0;
        //         for(let session of result){
        //             sess_count++;
        //             if(session._id.equals(current_session._id)){
        //                 var divs = []
        //                 for(let division of session.divisions){
        //                     if(division.d_id){
        //                        var div = {
        //                             _id:division.d_id,
        //                             campers:[]
        //                        };
        //                        for(let camper of division.campers){
        //                            if(camper.cSwimOpts.currentLevel){
        //                             if(div.campers["L"+camper.cSwimOpts.currentLevel.rcLevel])
        //                                     div.campers["L"+camper.cSwimOpts.currentLevel.rcLevel].push(camper);
        //                             else
        //                                     div.campers["L"+camper.cSwimOpts.currentLevel.rcLevel] = [camper];
        //                            }
        //                        }
        //                        divs.push(div);
        //                     }
        //                 }
        //                 for(let division of divs){
        //                     for(let level of Object.keys(division.campers)){
        //                         var groupCount = 0;
        //                         var d = camp.divisions.id(division._id);
        //                         var gen = d.gender == "male" ? "boys":"girls";
                                
        //                         var name = d.name+" "+gen+" "+level+" #";
        //                         campers = [];
        //                         var camperCount = 0
        //                         for(let camper of division.campers[level]){
        //                             campers.push(camper._id);
        //                             camperCount++;
        //                             if(camperCount == agMax){
        //                                 groupCount++;
        //                                 groupName = name+groupCount;
        //                                 let newGroup =  new SwimGroup({
        //                                     name:groupName,
        //                                     camperIds:campers,
        //                                     sessionId:current_session._id
        //                                 });
        //                                 camp.swimGroups.push(newGroup);
        //                                 campers = [];
                                        
        //                             }
        //                         }
        //                         if(campers.length > 0){
        //                             groupCount++;
        //                             groupName = name+groupCount;
        //                             let newGroup =  new SwimGroup({
        //                                 name:groupName,
        //                                 camperIds:campers,
        //                                 sessionId:current_session._id
        //                             });
        //                             camp.swimGroups.push(newGroup);
        //                             campers = [];
        //                         }
        //                     }
        //                 }
        //                 camp.save({ validateBeforeSave: false });
                        
        //             }
        //         }
        //             res.json({success:true});      
        //     });
        // })
        //.then(()=>{
        //     console.log("done");
        //     res.json({success:true});
        // });
    });
    
    router.post('/add_to_swim_group/',(req,res) => {
        SwimGroup.update({_id:req.body.groupId},{$push:{camper_ids:req.body.camperId.toString()}},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.id(req.body.groupId).camperIds.push(req.body.camperId);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/add_multiple_to_swim_group/',(req,res) => {
        SwimGroup.update({_id:req.body.groupId},{$push:{camper_ids:{ $each:req.body.camperIds}}},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.id(req.body.groupId).camperIds.push(req.body.camperId);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });


    router.post('/remove_from_swim_group/',(req,res) => {
        SwimGroup.update({_id:req.body.groupId},{$pull:{camper_ids:req.body.camperId.toString()}},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.id(req.body.groupId).camperIds.pull(req.body.camperId);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/register_level/',(req,res) => {
        const level = new SwimLevel(req.body);
        level.save();
        res.json({success:true});

        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var level = camp.options.swimOpts.swimLevels.create(req.body);
        //     camp.options.swimOpts.swimLevels.push(level);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.post('/remove_swim_level/',(req,res) => {
        SwimLevel.remove({_id:req.body.id},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.options.swimOpts.swimLevels.pull(req.body.id);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.get('/all_levels',(req,res) => {
        SwimLevel.find({}).sort( { _id: 1 } ).then((swimLevels)=>{
            res.json({success:true,levels:swimLevels});
        })
        // Camp.findById(req.decoded.campId, (err,camp)=>{
        //     // camp.options.swimOpts = {
        //     //     swimLevels:[]
        //     // };
        //     // camp.save({ validateBeforeSave: false });
        //     res.json({success:true,levels:camp.options.swimOpts.swimLevels});
        // });
    });

    router.get('/get_swim_level/:id',(req,res) => {
        SwimLevel.findById(req.params.id,(err,swimLevel)=>{
            res.json({success:true,level:swimLevel});
        })
        // Camp.findById(req.decoded.campId, (err,camp)=>{
        //     var data = camp.options.swimOpts.swimLevels.id(req.params.id);
        //     res.json({success:true,level:data});
        // });
    });

    router.post('/set_swim_level/',(req,res) => {
        Camper.findById(req.body.camperId,(err,camper)=>{
            camper.cSwimOpts.currentLevel = req.body.level;
            camper.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_swim_animal/',(req,res) => {
        SwimLevel.findById(req.body.id, (err, level)=>{
            var animal = level.animals.create(req.body.swimAnimal);
            level.animals.push(animal);
            level.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var animal = camp.options.swimOpts.swimLevels.id(req.body.id).animals.create(req.body.swimAnimal);
        //     camp.options.swimOpts.swimLevels.id(req.body.id).animals.push(animal);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/register_animal_skill/',(req,res) => {
        SwimLevel.findById(req.body.id, (err, level)=>{
            var skill = level.animals.id(req.body.swimAnimalId).skills.create({skill:req.body.skill});
            level.animals.id(req.body.swimAnimalId).skills.push(skill);
            level.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var skill = camp.options.swimOpts.swimLevels.id(req.body.id).animals.id(req.body.swimAnimalId).skills.create({skill:req.body.skill});
        //     camp.options.swimOpts.swimLevels.id(req.body.id).animals.id(req.body.swimAnimalId).skills.push(skill);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/xy_set_animal/',(req,res) => {
        SwimLevel.findById(req.body.level, (err, level)=>{
            var skill = level.animals.id(req.body.swimAnimalId).skills.id(req.body.skill);
            skill.pdfLoc = req.body.pos;
            level.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var skill = camp.options.swimOpts.swimLevels.id(req.body.level).animals.id(req.body.animal).skills.id(req.body.skill);
        //     skill.pdfLoc = req.body.pos;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/register_exit_skill/',(req,res) => {
        SwimLevel.findById(req.body.id, (err, level)=>{
            var skill = level.animals.id(req.body.swimAnimalId).exitSkills.create({skill:req.body.skill});
            level.animals.id(req.body.swimAnimalId).exitSkills.push(skill);
            level.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var skill = camp.options.swimOpts.swimLevels.id(req.body.id).exitSkills.create({skill:req.body.skill});
        //     camp.options.swimOpts.swimLevels.id(req.body.id).exitSkills.push(skill);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/remove_animal_skill/',(req,res) => {
        SwimLevel.findById(req.body.levelId, (err, level)=>{
            level.animals.id(req.body.animalId).skills.pull(req.body.skillId);
            level.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.options.swimOpts.swimLevels.id(req.body.levelId).animals.id(req.body.animalId).skills.pull(req.body.skillId);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/remove_exit_skill/',(req,res) => {
        SwimLevel.findById(req.body.levelId, (err, level)=>{
            level.animals.id(req.body.animalId).exitSkills.pull(req.body.skillId);
            level.save({ validateBeforeSave: false });
            res.json({success:true});
        });
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.options.swimOpts.swimLevels.id(req.body.levelId).exitSkills.pull(req.body.skillId);
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });


    router.post('/check_skill/',(req,res) => {
        Camper.findById(req.body.camperId,(err,camper)=>{
            var skill = camper.cSwimOpts.currentLevel.animals.id(req.body.animalId).skills.id(req.body.skillId);
            skill.completed = req.body.checked;
            camper.save({ validateBeforeSave: false });
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var skill = camp.campers.id(req.body.camperId).cSwimOpts.currentLevel.animals.id(req.body.animalId).skills.id(req.body.skillId);
        //     skill.completed = req.body.checked;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/check_exit_skill/',(req,res) => {
        Camper.findById(req.body.camperId,(err,camper)=>{
            var skill = camper.cSwimOpts.currentLevel.exitSkills.id(req.body.skillId);
            skill.completed = req.body.checked;
            camper.save({ validateBeforeSave: false });
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var skill = camp.campers.id(req.body.camperId).cSwimOpts.currentLevel.exitSkills.id(req.body.skillId);
        //     skill.completed = req.body.checked;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
            
        // });
    });

    router.post('/level_complete/',async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        const swimLevels = await SwimLevel.find({camp_id:req.decoded.campId}).sort({_id:1});
        Camper.findById(req.body.camperId,(err,camper)=>{
            var cSwimOpts = camper.cSwimOpts;
            var completed = {
                camper_id: camper._id.toString(),
                level: cSwimOpts.currentLevel.rcLevel
            }
            camp.options.swimOpts.completed.push(completed);
            cSwimOpts.currentLevel.completed = true;
            cSwimOpts.currentLevel.sessionCompleted = camp.options.session;
            cSwimOpts.completedLevels.push(cSwimOpts.currentLevel);
            var level = cSwimOpts.currentLevel.rcLevel;
            for(let l of swimLevels){
                if(l.rcLevel == level+1){
                   cSwimOpts.currentLevel = l;
                }
            }
            camp.save({ validateBeforeSave: false });
            camper.save({ validateBeforeSave: false })
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var cSwimOpts = camp.campers.id(req.body.camperId).cSwimOpts;
        //     var completed = {
        //         camper: camp.campers.id(req.body.camperId),
        //         level: cSwimOpts.currentLevel.rcLevel
        //     }
        //     camp.options.swimOpts.completed.push(completed);
        //     cSwimOpts.currentLevel.completed = true;
        //     cSwimOpts.currentLevel.sessionCompleted = camp.options.session;
        //     cSwimOpts.completedLevels.push(cSwimOpts.currentLevel);
        //     var level = cSwimOpts.currentLevel.rcLevel;
        //     for(let l of camp.options.swimOpts.swimLevels){
        //         if(l.rcLevel == level+1){
        //            cSwimOpts.currentLevel = l;
        //         }
        //     }
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/register_lifeguard', (req,res)=>{
        Camp.findById(req.decoded.campId, async function(err, camp){
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
        console.log(typeof req.decoded.campId,req.decoded.campId)
        const s = await Specialty.findOne({camp_id:req.decoded.campId.toString(),name:"Lifeguard"});
        console.log(s)
        // for(let specialty of camp.specialties){
        //     if(specialty.name == "Lifeguard"){
        //         s = specialty;
        //         break;
        //     }
        // }
        
        let counselor = new Counselor({
            _id:req.body._id.toString(),
            camp_id: camp._id.toString(),
            first: req.body.first,
            last: req.body.last,
            gender:req.body.gender,
            type: t,
            specialty_id: s._id.toString(),
            session_ids: [camp.options.session._id.toString()]
        })
        console.log(counselor);
        await counselor.save();

        let user = new User({
            camp_id: camp._id.toString(),
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            first: req.body.first,
            last: req.body.last,
            type:hst,
            counselorRef:counselor._id
        });
        user.save((err)=>{
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
                        else if(err.errors['email']){
                            res.json({
                                success:false,
                                message: err.errors['email'].message
                            });
                        }
                        else if(err.errors['password']){
                            res.json({
                                success:false,
                                message: err.errors['password'].message
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
        // counselor.save();
        // user.save();
        //camp.counselors.push(counselor);
        // camp.save({ validateBeforeSave: false });
        // bcrypt.hash(user.password,null,null,(err,hash) => {
        //         user.password = hash;
        //         Camp.update({_id:req.decoded.campId},{$push:{users:user}},(err)=>{
        //             if (err) {
        //                 if(err.code === 11000){
        //                     res.json({
        //                         success:false,
        //                         message: "Email already exists"
        //                     });
        //                 }
        //                 else{
        //                     if(err.errors){
        //                         if(err.errors.name){
        //                             res.json({
        //                                 success:false,
        //                                 message: "Camp name required"
        //                             });
        //                         }
        //                         else if(err.errors['users.0.email']){
        //                             res.json({
        //                                 success:false,
        //                                 message: err.errors['users.0.email'].message
        //                             });
        //                         }
        //                         else if(err.errors['users.0.password']){
        //                             res.json({
        //                                 success:false,
        //                                 message: err.errors['users.0.password'].message
        //                             });
        //                         }
        //                         else{
        //                             res.json({
        //                                 success:false,
        //                                 message: err.errors
        //                             });
        //                         }
        //                     }
        //                     else{
        //                         res.json({
        //                             success:false,
        //                             message: "Could not save user. Error: " + err
        //                         });
        //                     }
        //                 }
        //             }
        //             else{
        //                 res.json({
        //                     success:true,
        //                     message: "Account Registered!"
        //                 });
        //             }
        //         });
        //     });
        });
    });

    router.post('/assign_lifeguard', (req,res) => {

        SwimGroup.update({_id:req.body.groupId},{lifeguard_id:req.body.lifeguard},(err)=>{
            res.json({success:true});
        })

        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.id(req.body.groupId).lifeguardId = req.body.lifeguard;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/remove_lifeguard', (req,res) => {
        SwimGroup.update({_id:req.body.groupId},{$unset: { lifeguard_id: ""}},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.swimGroups.id(req.body.groupId).lifeguardId = undefined;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/set_bracelet', (req,res) => {
        console.log(req.body.id)
        Camper.findById(req.body.id,(err,camper)=>{
            console.log(camper);
            camper.cSwimOpts.bracelet = req.body.bracelet;
            camper.save({ validateBeforeSave: false });
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     camp.campers.id(req.body.id).cSwimOpts.bracelet = req.body.bracelet;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });
    });

    router.post('/change_AG_max/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
            camp.options.swimOpts.agMax = req.body.newMax;

            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/send_reports',async function(req,res){

        // nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            // let transporter = nodemailer.createTransport({
            //     host: 'smtp.ethereal.email',
            //     port: 587,
            //     secure: false, // true for 465, false for other ports
            //     auth: {
            //         user: account.user, // generated ethereal user
            //         pass: account.pass // generated ethereal password
            //     }
            // });
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                       user: 'northshoredaycampswim@gmail.com',
                       pass: 'NSDC!2018'
                   }
               });
            
            var group = await SwimGroup.findById(req.body.groupId);
            for(let cid of group.camper_ids){
                var camper = await Camper.findById(cid);
                if(camper.cSwimOpts.sendReport){
                    console.log("test 2: sendReport flagged");
                    camper.cSwimOpts.mostRecentReportSent = new Date();
                    setMessage(group,camper,transporter);
                    camper.save({ validateBeforeSave: false })
                }
            }
            res.json({success:true});
        // });
    });

    router.post('/change_send_report/',(req,res) => {
        Camper.update({_id:req.body.camper._id},{"cSwimOpts.sendReport":req.body.sendReport},(err)=>{
            res.json({success:true});
        })
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     var camper = camp.campers.id(req.body.camper._id);
        //     camper.cSwimOpts.sendReport = req.body.sendReport;
        //     camp.save({ validateBeforeSave: false });
        //     res.json({success:true});
        // });

    });

    router.get('/get_completed/',(req,res) => {
       Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            {
                $project:{completed:"$options.swimOpts.completed"}
            },
            {
                $unwind:"$completed"
            },
            { $lookup:{
                from: "campers",
                localField: "completed.camper_id",
                foreignField: "_id",
                as: "completed.camper"
                }
            },
            { $unwind:{path:"$completed.camper",preserveNullAndEmptyArrays: true}},
            {
                $project:{
                    first:"$completed.camper.first",
                    last:"$completed.camper.last",
                    level:"$completed.level"
                }
            }

       ],(err,result)=>{
        console.log(result);
        res.json({success:true,completed:result});
       })

    });

    router.post('/merge_groups/', async function(req,res) {
        var group1 = await SwimGroup.findById(req.body.group1);
        var group2 = await SwimGroup.findById(req.body.group2);
        group2.camper_ids = group2.camper_ids.concat(group1.camper_ids);
        group2.save();
        await SwimGroup.findByIdAndRemove(req.body.group1)
        res.json({success:true});

     });

    return router;
}

function setMessage(group,camper,transporter){

    //SET LINKS PROPERLY
    var text = "Please use the link below to view your child’s Swim Progress Report for this summer!\n";
    text+= "localhost:4200/swim-report/"+camper._id+"/"+group._id+"/-1";

    var html = "<p>Please use the link below to view your child’s Swim Progress Report for this summer!</p>";
    html+= "<a href = localhost:4200/swim-report/"+camper._id+"/"+group._id+"/-1"+">Click here to see the report</a></br>"
    html+="<p>If the above link doesn't work, please copy and paste the following into your browser:</p>";
    html+='<p>'+"localhost:4200/swim-report/"+camper._id+"/"+group._id+"/-1"+'</p></br>'
    html+='<p>*If viewing on your phone, once you click on the link above, click the “download report” button on the bottom left of your screen.*</p>'
    html+='<p>*Please note your swim report is best viewed on a laptop or desktop*</p>'

    //SET EMAILS PROPERLY!
    var emails = ['awprogramming@gmail.com'];
    if(camper.p1Email)
        emails.push(camper.p1Email)
    if(camper.p2Email)
        emails.push(camper.p2Email)
    
    for(let email of emails){
        let mailOptions = {
            from: '"North Shore Day Camp" <northshoredaycampswim@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'NSDC Swim Reports', // Subject line
            text: text, // plain text body
            html: html // html body
        };
        var message = "Report Email Sent To "+email;
        sendEmail(mailOptions,message,transporter);
    }
}

async function sendEmail(mailOptions,message,transporter){
    console.log("test 4: send email")
    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
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