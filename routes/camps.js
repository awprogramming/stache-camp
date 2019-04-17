const Camp = require('../models/camp');
const Camper = require('../models/camper');
const Counselor = require('../models/counselor');
const Division = require('../models/division');
const Specialty = require('../models/specialty');
const Session = require('../models/session');
const User = require('../models/user');
const EvalOpts = require('../models/evalOpts');
const Evaluation = require('../models/evaluation');
const Question = require('../models/question');
const SwimLevel = require('../models/swimLevel');
const SwimOpts = require('../models/cSwimOpts')
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
ObjectID = require('mongodb').ObjectID;

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
            Camp.findById(req.decoded.campId).exec()
            .then(function(camp){
                return camp.options.session;
            })
            .then(function(session){
                User.findById(req.decoded.userId).exec()
                .then(function(user){
                    if(user.type.type == "leader"){
                        Counselor.aggregate([
                                {
                                    $unwind:"$session_ids"
                                },
                                {
                                    $addFields: {

                                        d_id: { $toObjectId: "$division_id" },
                                        s_id: { $toObjectId: "$specialty_id" }
                                    }
                                },
                                { $lookup:{
                                    from: "divisions",
                                    localField: "d_id",
                                    foreignField: "_id",
                                    as: "division"
                                }},
                                { $lookup:{
                                    from: "specialties",
                                    localField: "s_id",
                                    foreignField: "_id",
                                    as: "specialty"
                                }},
                                {
                                    $unwind:'$division'
                                },
                                {
                                    $unwind:'$division.leader_ids'
                                },
                                {
                                    $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}
                                },
                                {
                                    $redact: {
                                      $cond: {
                                        if: {
                                            $and:[
                                                {$eq: [ "$division.leader_ids", user._id.toString() ]},
                                                {$eq: [ "$session_ids",session._id.toString()]}
                                            ] 
                                            
                                        },
                                        then: "$$KEEP",
                                        else: "$$PRUNE"
                                      }
                                    }
                                },
                                { $sort : { last : 1} },
                                {
                                    $group:{
                                        _id:"$division.name",
                                        counselors: {$push:"$$ROOT"}
                                    }
                                }
                            ])
                        .then(function(counselors){
                            res.json({counselors:counselors});
                        })   
                    }
                    else{
                        Counselor.aggregate([
                            {
                                $unwind:"$session_ids"
                            },
                            {
                                $addFields: {
                                    d_id: { $toObjectId: "$division_id" },
                                    s_id: { $toObjectId: "$specialty_id" }
                                }
                            },
                            { $lookup:{
                                from: "divisions",
                                localField: "d_id",
                                foreignField: "_id",
                                as: "division"
                            }},
                            { $lookup:{
                                from: "specialties",
                                localField: "s_id",
                                foreignField: "_id",
                                as: "specialty"
                            }},
                            {
                                $unwind:'$division'
                            },
                            {
                                $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}
                            },
                            {
                                $unwind:"$specialty.head_specialist_ids"
                            },
                            {
                                $redact: {
                                  $cond: {
                                    if: {
                                        $and:[
                                            {$eq: [ "$specialty.head_specialist_ids", user._id.toString() ]},
                                            {$eq: [ "$session_ids",session._id.toString()]}
                                        ] 
                                        
                                    },
                                    then: "$$KEEP",
                                    else: "$$PRUNE"
                                  }
                                }
                            },
                            { $sort : { last : 1} },
                            {
                                $group:{
                                    _id:"$specialty.name",
                                    counselors: {$push:"$$ROOT"}
                                }
                            }
                            ])
                        .then(function(counselors){
                            console.log(counselors);
                            res.json({counselors:counselors});
                        })   
                    }
                })
        });
        }
        else{
        Camp.findById(req.decoded.campId).exec().then((camp)=>{
            const current_session = camp.options.session;
            Counselor.aggregate([
                { $match: {camp_id:req.decoded.campId}},
                { $sort : { last : 1} },
                {$addFields: {
                        convertedId: { $toObjectId: "$division_id" }
                    }
                },
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                }},
                { $unwind:{path:"$division",preserveNullAndEmptyArrays: true}},
                {$addFields: {
                        convertedSId: { $toObjectId: "$specialty_id" }
                    }
                },
                { $lookup:{
                    from: "specialties",
                    localField: "convertedSId",
                    foreignField: "_id",
                    as: "specialty"
                }},
                { $unwind:{path:"$specialty",preserveNullAndEmptyArrays: true}},
                { $unwind: '$session_ids'},
                {$addFields: {
                        convertedSId: { $toObjectId: "$session_ids" }
                    }
                },
                { $lookup:{
                    from: "sessions",
                    localField: "convertedSId",
                    foreignField: "_id",
                    as: "sessions"
                }},
                { $group : { _id : {session_id:"$sessions._id",session_name:"$sessions.name"}, counselors:{$push:"$$ROOT"}}},
                { $sort: {"_id.session_id":-1}},
                
            ],(err,result)=>{
                const output = {
                    "sessions":result,
                    "cur_session":current_session
                }
                res.json({success:true,output:output});
            });
        });
        
        }
    });

    router.get('/all_lifeguards',async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        Counselor.aggregate([
            {
                $redact: {
                  $cond: {
                    if: {
                        $in: [ curSession,"$session_ids"],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                  }
                }
            },
            {
                $match:{specialty_id:"5b24054d002869723910c0e0"}
            },
            { $sort : { last : 1} },
        ],(err,lifeguards)=>{
            res.json({success:true,lifeguards:lifeguards});
        })
            // Camp.findById(req.decoded.campId).exec()
            // .then(function(camp){
            //         var hsSpecialties = [];
            //         for(let specialty of camp.specialties){
            //             if(specialty.name == 'Lifeguard'){
            //                 hsSpecialties.push(specialty._id);
            //                 break;
            //             }
            //         }
            //         var result = {
            //             "hsS": hsSpecialties,
            //             "camp":camp
            //         }
            //         return result;
                    
            // })
            // .then(function(result){
            //     var hsSpecialties = result.hsS;
            //     var result = result.camp;
            //     var counselors = {};
            //     var ctr = 0;
            //     var finished = false;
            //     for(let counselor of result.counselors){
            //         var hired = false;
            //         for(let session of counselor.sessions){
            //             if(session._id.equals(result.options.session._id)){
            //                 hired = true;
            //                 break;
            //             }
            //         }
            //         if(hired){
            //             for(let specialty of hsSpecialties){
            //                 if(counselor.type.type == "specialist" && counselor.specialty && counselor.specialty._id.equals(specialty)){
            //                     if(!(counselor.specialty.name in counselors))
            //                         counselors[counselor.specialty.name] = []
            //                     counselors[counselor.specialty.name].push(counselor);
            //                 }
            //             }
            //         }
            //     }
            //     return counselors;
            // })
            // .then(function(counselors){
            //     res.json({success:true,lifeguards:counselors});
            // });
    });

    router.post('/add_counselor',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            const sessions = [];
            sessions.push(camp.options.session._id.toString());
            const counselor = req.body;
            counselor.camp_id = camp._id.toString()
            counselor.session_ids = sessions;
            const newCounselor = new Counselor(counselor);
            for(let mod of camp.modules){
                if(mod.short_name=="eval"){
                    newCounselor.evaluations = [];
                    const evaluation = Evaluation.create({
                        number: camp.options.evaluationOpts.currentEval,
                        session_id: camp.options.session._id.toString(),
                        started: false,
                        submitted: false,
                        approved: false,
                        answers: []
                    }).then((evaluation)=>{
                        Question.find({camp_id:camp._id.toString(),"type._id":newCounselor.type._id},(err,questions)=>{
                            for(let question of questions){
                                if(question.type._id.equals(newCounselor.type._id)){
                                    const answer = {
                                        question_id:question._id.toString()
                                    };
                                    evaluation.answers.create(answer);
                                    evaluation.answers.push(answer);
                                }
                            }
                            newCounselor.evaluations.push(evaluation);
                            newCounselor.save({ validateBeforeSave: false });
                        });
                    })    
                    break;
                }
            }
        }).then((camp)=>{
            res.json({success:true});
        });
        // Camp.update({"_id":req.decoded.campId},{$push:{counselors:req.body}}, (err, camp)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
    });

    router.post('/bulk_add_counselor/:eval', async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        if(req.params.eval==='true'){
            for(let counselorData of req.body){
                var c = await Counselor.findById(counselorData.counselor._id);
                var newCounselor;
                var oldCounselor = false;
                var hired = false;
                if(c){
                    for(let session_id of c.session_ids){
                        if(session_id.equals(curSession)){
                            hired = true;
                            break;
                        } 
                    }
                    oldCounselor = true;
                }
                else{
                    c = new Counselor(counselorData.counselor);
                    c.camp_id = req.decoded.campId.toString();
                    c.session_ids = [];
                }
                
                if(!hired){
                    c.session_ids.push(curSession);
                    c.type = counselorData.counselor.type;
                    var newDivision = camp.getDivisionByName(counselorData.divisionName.trim(),counselorData.counselor.gender.toLowerCase());
                    if(newDivision)
                        c.division_id = newDivision._id.toString();

                    var newSpecialty = camp.getSpecialtyByName(counselorData.specialtyName.trim());
                    if(newSpecialty)
                        c.specialty_id = newSpecialty._id;
                    
                    c.evaluations = [];
                    var evaluation = new Evaluation({
                        number: camp.options.evaluationOpts.currentEval,
                        session_id: camp.options.session._id.toString(),
                        started: false,
                        submitted: false,
                        approved: false,
                        answers: []
                    });
                   
                    const questions = await Question.find({camp_id:camp._id.toString(),"type._id":newCounselor.type._id})
                    for(let question of questions){
                        if(question.type._id.equals(newCounselor.type._id)){
                            const answer = {
                                question_id:question._id.toString()
                            };
                            evaluation.answers.create(answer);
                            evaluation.answers.push(answer);
                        }
                    }
                    c.evaluations.push(evaluation);  
                }
                c.save({ validateBeforeSave: false });
            }
        }
        else{
            for(let counselorData of req.body){
                var c = await Counselor.findById(counselorData.counselor._id);
                var newCounselor;
                var oldCounselor = false;
                var hired = false;
                if(c){
                    for(let session_id of c.session_ids){
                        if(session_id.equals(curSession)){
                            hired = true;
                            break;
                        } 
                    }
                    oldCounselor = true;
                }
                else{
                    c = new Counselor(counselorData.counselor);
                    c.camp_id = req.decoded.campId.toString();
                    c.session_ids = [];
                }
                
                if(!hired){
                    c.session_ids.push(curSession);
                    c.type = counselorData.counselor.type;
                    var newDivision = camp.getDivisionByName(counselorData.divisionName.trim(),counselorData.counselor.gender.toLowerCase());
                    if(newDivision)
                        c.division_id = newDivision._id.toString();

                    var newSpecialty = camp.getSpecialtyByName(counselorData.specialtyName.trim());
                    if(newSpecialty)
                        c.specialty_id = newSpecialty._id;
                    
                }
                c.save({ validateBeforeSave: false });
            }
        }
        // if(req.params.eval==='true'){
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         for(let counselorData of req.body){
        //             var newCounselor;
        //             var oldCounselor = false;
        //             if(camp.counselors.id(counselorData.counselor._id)){
        //                 newCounselor = camp.counselors.id(counselorData.counselor._id)
        //                 oldCounselor = true;
        //             }
        //             else{
        //                 newCounselor = camp.counselors.create(counselorData.counselor);
        //                 newCounselor.sessions = [];
        //             }
        //             var hired = false;
        //             for(let session of newCounselor.sessions){
        //                 if(session._id.equals(camp.options.session._id)){
        //                     hired = true;
        //                     break;
        //                 } 
        //             }
        //             if(!hired){
        //                 newCounselor.sessions.push(camp.options.session);
        //                 newCounselor.type = counselorData.counselor.type;
        //                 var newDivision = camp.getDivisionByName(counselorData.divisionName.trim(),counselorData.counselor.gender.toLowerCase());
        //                 if(newDivision)
        //                     newCounselor.division = newDivision;

        //                 var newSpecialty = camp.getSpecialtyByName(counselorData.specialtyName.trim());
        //                 if(newDivision)
        //                     newCounselor.specialty = newSpecialty;

        //                 const evaluation = newCounselor.evaluations.create({
        //                     number: camp.options.evaluationOpts.currentEval,
        //                     session: camp.options.session,
        //                     started: false,
        //                     submitted: false,
        //                     approved: false,
        //                     answers: []
        //                 });
        //                 const answers = []
        //                 for(let question of camp.options.evaluationOpts.questions){
        //                     if(question.type._id.equals(newCounselor.type._id)){
        //                         const answer = {
        //                             question:question
        //                         };
        //                         evaluation.answers.create(answer);
        //                         evaluation.answers.push(answer);
        //                     }
        //                 }
        //                 newCounselor.evaluations.push(evaluation);
        //                 if(!oldCounselor)
        //                     camp.counselors.push(newCounselor);
        //             }
        //         }
        //         camp.save({ validateBeforeSave: false });
        //     })
        //     .then((camp)=>{
        //         res.json({success:true});
        //     });
        // }
        // else{
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         for(let counselorData of req.body){
        //             var newCounselor;
        //             var oldCounselor = false;
        //             if(camp.counselors.id(counselorData.counselor._id)){
        //                 newCounselor = camp.counselors.id(counselorData.counselor._id)
        //                 oldCounselor = true;
        //             }
        //             else{
        //                 newCounselor = camp.counselors.create(counselorData.counselor);
        //                 newCounselor.sessions = [];
        //             }
        //             var hired = false;
        //             for(let session of newCounselor.sessions){
        //                 if(session._id.equals(camp.options.session._id)){
        //                     hired = true;
        //                     break;
        //                 } 
        //             }
        //             if(!hired){
        //                 newCounselor.sessions.push(camp.options.session);
        //                 var newDivision = camp.getDivisionByName(counselorData.divisionName.trim(),counselorData.counselor.gender.toLowerCase());
        //                 if(newDivision)
        //                     newCounselor.division = newDivision;
        //                 var newSpecialty = camp.getSpecialtyByName(counselorData.specialtyName.trim());
        //                 if(newDivision)
        //                     newCounselor.specialty = newSpecialty;
        //                 if(!oldCounselor)
        //                     camp.counselors.push(newCounselor);
        //             }
        //         }
        //         camp.save({ validateBeforeSave: false });
        //         res.json({success:true});
        //     });
        // }
    });

    router.delete('/remove_counselor/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Counselor.remove({_id:req.params.id},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Counselor deleted!' }); 
                }
            });
        }
      });

      router.post('/rehire', async function(req,res){
        const camp = await Camp.findById(req.decoded.campId);
        var counselor = await Counselor.findById(req.body.counselor._id);
        counselor.session_ids.push(req.body.session._id.toString());
        if(camp.options.evaluationOpts){
            Evaluation.create({
                number: camp.options.evaluationOpts.currentEval,
                session_id: camp.options.session._id.toString(),
                started: false,
                submitted: false,
                approved: false,
                answers: []
            }).then((evaluation)=>{
                console.log(evaluation)
                Question.find({camp_id:camp._id.toString(),"type._id":counselor.type._id},(err,questions)=>{
                    console.log(questions);
                    for(let question of questions){
                        if(question.type._id.equals(counselor.type._id)){
                            const answer = {
                                question_id:question._id.toString()
                            };
                            evaluation.answers.create(answer);
                            evaluation.answers.push(answer);
                        }
                    }
                    counselor.evaluations.push(evaluation);
                    if(counselor.division)
                        counselor.division_id.remove();
                    if(counselor.specialty)
                        counselor.specialty_id.remove();
                    counselor.save({ validateBeforeSave: false });
                    res.json({success: true})
                });
            }); 
        }
        else{
            if(counselor.division)
                counselor.division.remove();
            if(counselor.specialty)
                counselor.specialty.remove();
            counselor.save({ validateBeforeSave: false });
            res.json({success: true})
        }
        // Camp.findById(req.decoded.campId, (err, camp)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         var counselor = camp.counselors.id(req.body.counselor._id);
        //         counselor.sessions.push(req.body.session);
        //         /***/
        //         if(camp.options.evaluationOpts){
        //             const evaluation = counselor.evaluations.create({
        //                 number: camp.options.evaluationOpts.currentEval,
        //                 session: camp.options.session,
        //                 started: false,
        //                 submitted: false,
        //                 approved: false,
        //                 answers: []
        //             });
        //             const answers = []
        //             for(let question of camp.options.evaluationOpts.questions){
        //                 if(question.type._id.equals(counselor.type._id)){
        //                     const answer = {
        //                         question:question
        //                     };
        //                     evaluation.answers.create(answer);
        //                     evaluation.answers.push(answer);
        //                 }
        //             }
        //             counselor.evaluations.push(evaluation);
        //         }
        //         /***/
        //         if(counselor.division)
        //             counselor.division.remove();
        //         if(counselor.specialty)
        //             counselor.specialty.remove();
                
        //         camp.save({ validateBeforeSave: false });
        //         res.json({success: true})
        //     }
        // });
      });

      router.get('/get_division_counselors/:divisionId/:sessionId',(req,res) => {
        Counselor.aggregate([
            {
                $match:{division_id:req.params.divisionId},
            },
            {
                $redact: {
                  $cond: {
                    if: {
                        $in: [ req.params.sessionId,"$session_ids"],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                  }
                }
            },
            {
                $project:{
                    _id:1,
                    first:1,
                    last:1,
                    gender:1
                }
            }
        ],(err,result)=>{
            res.json({success:true,counselors:result});
        })
        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$counselors'},
        //     { $project: {counselors:1}},
        //     { $unwind: '$counselors.sessions'},
        //     { $group : {
        //         _id : {s_id:"$counselors.sessions._id",d_id:"$counselors.division._id",d_name:"$counselors.divison.name"}, 
        //         counselors:{$push:"$counselors"}
        //        }
        //    },
        //     { $group : {
        //         _id : "$_id.s_id",
        //         divisions: {
        //             $push:{
        //                 d_id: "$_id.d_id",
        //                 d_name: "$_id.d_name",
        //                 counselors:"$counselors"}
        //             }
        //         } 
        //     },
        // ],(err,result)=>{
        //     var success = false;
        //     for(let session of result){
        //         if(session._id.equals(req.params.sessionId)){
        //             for(let division of session.divisions){
        //                 if(division.d_id.equals(req.params.divisionId)){
        //                     success = true;
        //                     res.json({success:success,division:division});
        //                 }
        //             }
        //         }
        //     }
        //     if(!success)
        //         res.json({success:success});
        // });
    });

    /* DIVISION ROUTES */


    router.get('/all_divisions',(req,res) =>{
        Division.aggregate([
            { $match: {camp_id:req.decoded.campId}},
            { $unwind:{path:"$leader_ids",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                convertedId: { $toObjectId: "$leader_ids" }
            }
            },
            { $lookup:{
                from: "users",
                localField: "convertedId",
                foreignField: "_id",
                as: "leaders"
                }
            },
            { $unwind:{path:"$leaders",preserveNullAndEmptyArrays: true}},
            { $group : { _id : {_id:"$_id",gender:"$gender",name:"$name",approver_ids:"$approver_ids"}, leaders:{$push:"$leaders"}}},
            { $unwind:{path:"$_id.approver_ids",preserveNullAndEmptyArrays: true}},
            { $addFields: {
                convertedId: { $toObjectId: "$_id.approver_ids" }
            }
            },
            { $lookup:{
                from: "users",
                localField: "convertedId",
                foreignField: "_id",
                as: "approvers"
                }
            },
            { $unwind:{path:"$approvers",preserveNullAndEmptyArrays: true}},
            { $group : { _id : {_id:"$_id._id",gender:"$_id.gender",name:"$_id.name",leaders:"$leaders"}, approvers:{$push:"$approvers"}}},
            { $group : { _id : {gender:"$_id.gender"}, divisions:{$push:{_id:"$_id._id",name:"$_id.name",leaders:"$_id.leaders",approvers:"$approvers"}}}},
            
        ],(err,result)=>{
            res.json({success:true,divisions:result});
        });
    });

    router.post('/register_division',(req,res) => {
        Division.create({name:req.body.name,grade:req.body.grade,gender:'male',camp_id:req.decoded.campId});
        Division.create({name:req.body.name,grade:req.body.grade,gender:'female',camp_id:req.decoded.campId});
        res.json({ success: true, message: 'division added!' }); 
    });

    router.delete('/remove_division/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Division.remove({_id:req.params.id},(err)=>{
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
       
        Counselor.update({_id:req.body._id},{$set:{division_id:req.body.toAdd._id.toString()}}, (err,counselor)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.post('/add_division_camper',(req,res) => {
        Camper.update({_id:req.body._id},{$set:{division_id:req.body.toAdd._id.toString()}}, (err,camper)=>{
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

        Camp.findById(req.body._id).exec().then((camp)=>{
            camp.modules.push(req.body.toAdd);
            if(req.body.toAdd.short_name=="eval"){
                let evalOpts = new EvalOpts();
                camp.options.evaluationOpts = evalOpts;
                camp.counselors.forEach((counselor)=>{
                    for(let session of counselor.sessions){
                        if(session.equals(camp.options.session)){
                            const evaluation = counselor.evaluations.create({
                                number: camp.options.evaluationOpts.currentEval,
                                session: camp.options.session,
                                started: false,
                                submitted: false,
                                approved: false,
                                answers: []
                            });
                            const answers = []
                            for(let question of camp.options.evaluationOpts.questions){
                                if(question.type._id.equals(counselor.type._id)){
                                    const answer = {
                                        question:question
                                    };
                                    evaluation.answers.create(answer);
                                    evaluation.answers.push(answer);
                                }
                            }
                            counselor.evaluations.push(evaluation);
                            break;
                        }
                    }
                    
                });
                camp.save({ validateBeforeSave: false });
                res.json({success:true});
            }
            else{
                camp.save({ validateBeforeSave: false });
                res.json({success:true});
            }
        });
    });

    router.get('/camp_modules',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.modules.length == 0){
                    res.json({success:false, message:'No modules registered'})
                }
                else{
                res.json({success:true,modules:camp.modules});
                }
            }
        });
    });

    /* HEAD STAFF ROUTES */

    router.post('/register_head_staff', (req,res) => {
        let user = new User({
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            first: req.body.first,
            last: req.body.last,
            type: req.body.type,
            camp_id: req.decoded.campId.toString()
        });
        bcrypt.hash(user.password,null,null,(err,hash) => {
            user.password = hash;
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
        });
    });

    router.get('/all_heads',(req,res) =>{
        User.find({camp_id:req.decoded.campId},(err,users)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(users.length == 1){
                    res.json({success:false, message:'No head staff registered'})
                }
                else{
                   res.json({success:true,heads:users.slice(1)});
                }
            }
        })
    });
    //
    router.delete('/remove_head/:id', (req, res) => {
       User.remove({_id:req.params.id},(err)=>{
        if(err){
            res.json({ success: false, message: 'Failed to delete' });
        }
        else{
            
            res.json({ success: true, message: 'Head staff member deleted!' }); 
        }
       });
      });

      router.post('/add_head_division',(req,res) => {
        Division.update({_id:req.body._id},{$push:{leader_ids:req.body.toAdd._id.toString()}},(err,div)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        })
    });

    router.post('/remove_head_division',(req,res) => {
        Division.update({_id:req.body.division_id},{$pull:{leader_ids:req.body.leader_id}},()=>{
            res.json({success:true});
        })
    });
    
    router.post('/add_head_specialty',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Specialty.update({_id:req.body._id},{$addToSet:{head_specialist_ids:toAdd._id}},(err)=>{
            res.json({success:true});
        });
    });

    router.post('/remove_head_specialty',(req,res) => {
        Specialty.update({_id:req.body.specialty_id},{$pull:{head_specialist_ids:req.body.leader_id}},(err)=>{
            res.json({success:true});
        });
    });

    router.post('/add_type_head',(req,res) => {
        User.update({_id:req.body._id},{$set:{type:req.body.toAddType}},(err)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        })
        // Camp.update({_id:req.decoded.campId,users:{$elemMatch:{_id:req.body._id}}},{$set:{"users.$.type":req.body.toAddType}}, (err,user)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
    });

    /* Specialties */

    router.post('/register_specialty',(req,res) => {
        let specialty = new Specialty({
            name:req.body.name,
            camp_id:req.decoded.campId
        });
        specialty.save();
        res.json({success:true});
    });

    router.get('/all_specialties',(req,res) =>{
        Specialty.aggregate([
            { $match: {camp_id:req.decoded.campId}},
            {
                $unwind:{path:"$head_specialist_ids",preserveNullAndEmptyArrays: true}
            },
            {$addFields: {
                    convertedId: { $toObjectId: "$head_specialist_ids" }
                }
            },
            { $lookup:{
                from: "users",
                localField: "convertedId",
                foreignField: "_id",
                as: "head_specialists"
                }
            },
            {
                $unwind:{path:"$head_specialists",preserveNullAndEmptyArrays: true}
            },
            { $group : { _id :{_id:"$_id",name:"$name",camp_id:"$camp_id",rosters:"$rosters"},head_specialists:{ $push : "$head_specialists" }}},
            {
                $project:{
                    "_id":"$_id._id",
                    "name":"$_id.name",
                    "camp_id":"$_id.camp_id",
                    "rosters":"$_id.rosters",
                    "head_specialists":"$head_specialists"
                }
            },

            ],(err,result)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(result.length == 0){
                    res.json({success:false, message:'No specialties registered'})
                }
                else{
                res.json({success:true,specialties:result});
                }
            }
        });
    });

    router.delete('/remove_specialty/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Specialty.remove({_id:req.params.id}).exec().then(()=>{
                res.json({ success: true, message: 'Specialty deleted!' }); 
            });
        }
      });

      router.post('/add_specialty_counselor',(req,res) => {
        Counselor.update({_id:req.body._id},{$set:{specialty_id:req.body.toAddSpecialty._id.toString()}},(err)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        })
        // Camp.update({_id:req.decoded.campId,counselors:{$elemMatch:{_id:req.body._id}}},{$set:{"counselors.$.specialty":req.body.toAddSpecialty}}, (err,counselor)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
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
            const sess = new Session(req.body);
            sess.camp_id = camp._id.toString();
            sess.save();
            camp.options.session = sess;
            if(camp.options.evaluationOpts){
                camp.options.evaluationOpts.currentEval = 1;
                camp.options.evaluationOpts.furthestReached = 1;
            }
            if(camp.options.swimOpts){
                camp.options.swimOpts.completed = [];
            }
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/register_type',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                camp.options.counselor_types.push(req.body);
                camp.save({ validateBeforeSave: false });
                res.json({success:true,options:camp.options});
            }
        });
    });

    router.delete('/remove_type/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findByIdAndUpdate(req.decoded.campId,{$pull:{"options.counselor_types":{_id:req.params.id}}},{new:true}).exec().then((camp) =>{
                camp.counselors.forEach((counselor)=>{
                    if(counselor.type._id.equals(req.params.id))
                        counselor.type.remove()
                })
                camp.save({ validateBeforeSave: false });
                return;
            }).then(()=>{
                res.json({ success: true, message: 'Type deleted!' }); 
            });
        }
      });

      router.post('/register_htype',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                camp.options.headStaff_types.push(req.body);
                camp.save({ validateBeforeSave: false });
                res.json({success:true,options:camp.options});
            }
        });
    });

    router.delete('/remove_htype/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findByIdAndUpdate(req.decoded.campId,{$pull:{"options.headStaff_types":{_id:req.params.id}}},{new:true}).exec().then((camp) =>{
                camp.users.forEach((user)=>{
                    if(user.type && user.type._id.equals(req.params.id))
                        user.type.remove()
                })
                camp.save({ validateBeforeSave: false });
                return;
            }).then(()=>{
                res.json({ success: true, message: 'Type deleted!' }); 
            });
        }
      });

      router.post('/change_HWS',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                camp.options.howWeSay[req.body.term] = req.body.newTerm;
                camp.save({ validateBeforeSave: false });
                res.json({success:true,options:camp.options});
            }
        });
    });

    /* Campers */

    router.get('/all_campers/:permissions',(req,res) =>{
        if(req.params.permissions == "user"){
            Camp.findById(req.decoded.campId).exec()
            .then(function(camp){
                return camp.options.session;
            })
            .then(function(session){
                User.findById(req.decoded.userId).exec()
                .then(function(user){
                    if(user.type.type == "leader"){
                        Camper.aggregate([
                            {
                                $unwind:"$session_ids"
                            },
                            {
                                $addFields: {
                                    d_id: { $toObjectId: "$division_id" }
                                }
                            },
                            { $lookup:{
                                from: "divisions",
                                localField: "d_id",
                                foreignField: "_id",
                                as: "division"
                            }},
                            {
                                $unwind:'$division'
                            },
                            {
                                $unwind:'$division.leader_ids'
                            },
                            {
                                $redact: {
                                  $cond: {
                                    if: {
                                        $and:[
                                            {$eq: [ "$division.leader_ids", user._id.toString() ]},
                                            {$eq: [ "$session_ids",session._id.toString()]}
                                        ] 
                                        
                                    },
                                    then: "$$KEEP",
                                    else: "$$PRUNE"
                                  }
                                }
                            },
                            { $sort : { last : 1} },
                            {
                                $group:{
                                    _id:"$division.name",
                                    campers: {$push:"$$ROOT"}
                                }
                            }
                        ])
                        .then(function(campers){
                            res.json({campers:campers});
                        })   
                    }
                });
            });
        }
        else{
        Camp.findById(req.decoded.campId).exec().then((camp)=>{
            const current_session = camp.options.session;
            Camper.aggregate([
                { $match: {camp_id:req.decoded.campId}},
                { $sort : { last : 1} },
                {$addFields: {
                        convertedId: { $toObjectId: "$division_id" }
                    }
                },
                { $lookup:{
                    from: "divisions",
                    localField: "convertedId",
                    foreignField: "_id",
                    as: "division"
                }},
                {
                    $unwind:{path:"$division",preserveNullAndEmptyArrays: true}
                },
                { $unwind: '$session_ids'},
                {$addFields: {
                        session_id_converted: { $toObjectId: "$session_ids" }
                    }
                },
                { $lookup:{
                    from: "sessions",
                    localField: "session_id_converted",
                    foreignField: "_id",
                    as: "session"
                }},
                { $group : { _id : {session_id:"$session._id",session_name:"$session.name"},campers:{ $push : "$$ROOT" }}},
                
            ],(err,result)=>{
                const output = {
                    "sessions":result,
                    "cur_session":current_session
                }
                res.json({success:true,output:output});
            });
        });
        }
    });

    router.get('/get_all_division_campers/',async function(req,res){ //FOR CURRENT SESSION
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
            { $sort : { last : 1} },
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
                    _id: {d_id:"$division._id",d_name:"$division.name"},
                    campers:{$push:"$$ROOT"}
                }
            },
            {
                $project:{
                    d_id: "$_id.d_id",
                    d_name: "$_id.d_name",
                    campers:"$campers"
                }
            },

        ],(err,result)=>{
            res.json({divisions:result});
        })
        
        // Camp.findById(req.decoded.campId).exec().then((camp)=>{
        //     const current_session = camp.options.session;
        //     Camp.aggregate([
        //         { $match: {camp_id:(req.decoded.campId)}},
        //         { $unwind: '$campers'},
        //         { $project: {campers:1}},
        //         { $unwind: '$campers.sessions'},
        //         { $group : {
        //             _id : {s_id:"$campers.sessions._id",d_id:"$campers.division._id",d_name:"$campers.divison.name"}, 
        //             campers:{$push:"$campers"}
        //         },
        //         {

        //         }
        //     },
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
        //         for(let session of result){
        //             if(session._id.equals(current_session._id)){
        //                 for(let division of session.divisions){
        //                     if(!division.d_id){
        //                         division.d_id = {name:"No Assigned Division"};
        //                     }
        //                     else{
        //                         division.d_id = camp.divisions.id(division.d_id);
        //                     }
        //                 }
        //                 res.json({success:true,output:session});
        //             }
        //         }
        //     });
        // });
    });

    router.get('/get_division_campers/:divisionId',async function(req,res) {
        console.log(req.params.sessionId,req.params.divisionId)
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        Camper.aggregate([
            {
                $redact: {
                    $cond: {
                    if: {
                    $and:[
                        {$in: [ curSession,"$session_ids"]},
                        {$eq: [ { $toString:"$division_id"},req.params.divisionId]}
                    ]},
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
            { $sort : { last : 1} },
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
                    _id: {d_id:"$division._id",d_name:"$division.name"},
                    campers:{$push:"$$ROOT"}
                }
            },
            {
                $project:{
                    d_id: "$_id.d_id",
                    d_name: "$_id.d_name",
                    campers:"$campers"
                }
            },

        ],(err,result)=>{
            console.log(result)
            res.json({division:result[0]});
        })
    });

    router.get('/get_camper/:camperId',(req,res)=>{
        Camper.findById(req.params.camperId,(err,camper)=>{
            res.json({success:true,camper:camper});
        });

    });

    router.post('/add_camper',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            const sessions = [];
            sessions.push(camp.options.session._id.toString());
            const camper = req.body;
            camper.camp_id = camp._id.toString();
            camper.session_ids = sessions;
            
            if(camp.hasModule("swim")){
                camper.cSwimOpts = {
                    bracelet: "none"
                }
            }
            if(camp.hasModule("meds")){
                camper.meds = {
                    "epi" : false,
                    "inhaler" : false,
                    "other" : []
                }
                camper.dietary = {
                    "allergies" : [],
                    "other" : []
                }
            }
            Camper.create(camper);
        }).then(()=>{
            res.json({success:true});
        });
    });

    router.post('/edit_camper', async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        if(camp.hasModule("swim")){
            Camper.update(
                {_id:req.body._id},
                {
                    first: req.body.first,
                    last: req.body.last,
                    p1Name: req.body.p1Name,
                    p1Email: req.body.p1Email,
                    p2Name: req.body.p2Name,
                    p2Email: req.body.p2Email,
                    gender: req.body.gender,
                },(err)=>{
                    res.json({success: true})
                }
            );
        }
        else{
            Camper.update(
                {_id:req.body._id},
                {
                    first: req.body.first,
                    last: req.body.last,
                    gender: req.body.gender,
                },(err)=>{
                    res.json({success: true})
                }
            );
        }
    });

    router.post('/bulk_add_camper', async function(req,res) {
        const camp = await Camp.findById(req.decoded.campId);
        var curSession = camp.options.session._id.toString();
        if(camp.hasModule("swim")){
            for(let camper of req.body){
                console.log(camper);
                var newDivision;
                var newCamper;
                var oldCamper = false;
                var c = await Camper.findById(camper.camper._id);
                
                var reenrolled = false;
                if(c){
                    oldCamper = true;
                    for(let session_id of c.session_ids){
                        if(session_id == curSession){
                            reenrolled = true;
                            break;
                        }
                    }
                }
                else{
                    c = new Camper(camper.camper);
                    c.camp_id = req.decoded.campId.toString();
                    c.session_ids = [];
                }

                if(!reenrolled)
                    c.session_ids.push(curSession);

                if(camper.divisionName && camper.divisionName != ""){
                    console.log(req.decoded.campId.toString(),camper.divisionName,camper.camper.gender);
                    newDivision = await Division.findOne({camp_id:req.decoded.campId.toString(),name:camper.divisionName,gender:camper.camper.gender});
                    console.log(newDivision);
                }
                
                if(newDivision)
                    c.division_id = newDivision._id.toString();
                else
                    c.division_id = undefined; 
                
                if(!oldCamper){
                    var level = camper.cSwimOpts.rcLevel;
                    var complete = false;
                    c.cSwimOpts = new SwimOpts();
                    c.cSwimOpts.currentLevel = await SwimLevel.findOne({camp_id:req.decoded.campId,rcLevel:level});
                }
                console.log(c);
                c.save({validateBeforeSave:false});


            //     if(camp.campers.id(camper.camper._id)){
            //         newCamper = camp.campers.id(camper.camper._id);
            //         oldCamper = true;
            //     }
            //     else{
            //         var newCamper = camp.campers.create(camper.camper);
            //         newCamper.sessions = [];
            //     }
            //     var reenrolled = false;
            //     for(let session of newCamper.sessions){
            //         if(session._id.equals(camp.options.session._id)){
            //             reenrolled = true;
            //             break;
            //         }
            //     }
            //     if(!reenrolled){
            //         newCamper.sessions.push(camp.options.session);
            //         if(camper.divisionName)
            //             newDivision = camp.getDivisionByName(camper.divisionName.trim(),newCamper.gender.toLowerCase());
            //         if(newDivision)
            //             newCamper.division = newDivision;
                    
            //         console.log(camper.divisionName,"*",newDivision,"*",camper.division);
                    
            //     }
            //     if(!oldCamper){
                    
            //         var level = camper.cSwimOpts.rcLevel;
            //         var complete = false;
            //         for(let l of camp.options.swimOpts.swimLevels){
            //             if(l.rcLevel == level){
            //             newCamper.cSwimOpts.currentLevel = l;
            //             }
            //         }
                    
            //         if(!oldCamper)
            //             camp.campers.push(newCamper);
            //     }
            }
        }
        // else{
        //     var count = 0;
        //     for(let data of req.body){
        //         var newCamper;
        //         var oldCamper = false;
        //         if(camp.campers.id(data.camper._id)){
        //             newCamper = camp.campers.id(data.camper._id);
        //             oldCamper = true;
        //             count++;
        //         }
        //         else{
        //             var newCamper = camp.campers.create(data.camper);
        //             console.log("******")
        //             if(camp.hasModule("meds")){
        //                 newCamper.meds = {
        //                     "epi" : false,
        //                     "inhaler" : false,
        //                     "other" : []
        //                 }
        //                 newCamper.dietary = {
        //                     "allergies" : [],
        //                     "other" : []
        //                 }
        //             }
                    
        //             newCamper.sessions = [];
        //         }
        //         var reenrolled = false;
        //         for(let session of newCamper.sessions){
        //             if(session._id.equals(camp.options.session._id)){
        //                 reenrolled = true;
        //                 break;
        //             }
        //         }
        //         if(!reenrolled){
        //             console.log(data.divisionName);
        //             if(data.divisionName)
        //                 newDivision = camp.getDivisionByName(data.divisionName.trim(),newCamper.gender.toLowerCase());
        //             if(newDivision)
        //                 newCamper.division = newDivision;
        //             newCamper.sessions.push(camp.options.session);
        //             camp.campers.push(newCamper);
        //         }
        //     }
        //     console.log(count);
        // }
        // camp.save({ validateBeforeSave: false });
        res.json({success:true});
    });

    router.delete('/remove_camper/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
           Camper.remove({_id:req.params.id},(err)=>{
            if(err){
                res.json({ success: false, message: 'Failed to delete' });
            }
            else{
                res.json({ success: true, message: 'Camper deleted!' }); 
            }
           });
        }
      });

      router.post('/reenroll',(req,res)=>{
        Camper.update({_id:req.body.camper._id},{$push:{session_ids:req.body.session._id.toString()},$unset: { division_id: ""}},()=>{
            res.json({success: true})
        });
      });
    
    return router;
}