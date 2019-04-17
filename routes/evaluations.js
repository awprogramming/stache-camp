const Camp = require('../models/camp');
const Counselor = require('../models/counselor');
const User = require('../models/user');
const Question = require('../models/question');
const Division = require('../models/division');
const Evaluation = require('../models/evaluation');
const EvaluationComment = require('../models/evaluationComment');

const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const json2csv = require('json2csv');

module.exports = (router) => {

    router.get('/all_questions',(req,res)=>{
        Question.aggregate([
            { $match: {camp_id:req.decoded.campId.toString()}},
            { $group : { _id : {type_id:"$type._id",type_name:"$type.type"},questions:{$push:"$$ROOT"}}},  
        ],(err,result)=>{
            res.json({success:true,types:result});
        });
    });
    
    
    router.post('/register_question',(req,res) =>{
        var question = new Question(req.body);
        question.camp_id = req.decoded.campId.toString();
        question.save();
        res.json({success:true});
    });
    
    router.delete('/remove_question/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Question.remove({_id:req.params.id},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Question deleted!' }); 
                }
            })
        }
      });

    router.post('/change_per_session',(req,res) =>{

        Camp.update({"_id":req.decoded.campId},{"options.evaluationOpts.perSession":req.body.perSession}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.post('/change_period',(req,res)=>{
        Camp.findByIdAndUpdate(req.decoded.campId,{"options.evaluationOpts.currentEval":req.body.period},{new:true}, async function(err, camp){
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.options.evaluationOpts.currentEval > camp.options.evaluationOpts.furthestReached){
                    camp.options.evaluationOpts.furthestReached = camp.options.evaluationOpts.currentEval;
                    const counselors = await Counselor.find({camp_id:req.decoded.campId,session_ids:{$elemMatch:{$eq:camp.options.session._id.toString()}}});
                    
                    counselors.forEach((counselor)=>{
                        const evaluation = Evaluation.create({
                            number: camp.options.evaluationOpts.currentEval,
                            session_id: camp.options.session._id.toString(),
                            started: false,
                            submitted: false,
                            approved: false,
                            answers: []
                        }).then((evaluation)=>{
                            Question.find({camp_id:camp._id.toString(),"type._id":counselor.type._id},(err,questions)=>{
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
                                counselor.save({ validateBeforeSave: false });
                            });
                                
                        });
                    });
                }

                res.json({success:true});
            }
        });
    });

    router.get('/get_all_current/',(req,res)=>{
        Camp.findById(req.decoded.campId).exec().then(async function(camp){
            const current_session = camp.options.session;
            var type;
            const user = await User.findOne({_id:req.decoded.userId});
            if(camp.admin == req.decoded.userId || user.type.type == "admin"){
                Counselor.aggregate([
                    { $match: {camp_id:req.decoded.campId.toString()}},
                    // { $unwind: '$session_ids'},
                    // {
                    //     $redact: {
                    //       $cond: {
                    //         if: {$eq: [ "$session_ids",current_session._id.toString()]}, 
                    //         then: "$$KEEP",
                    //         else: "$$PRUNE"
                    //         },
                    //     }
                    // },
                    { $unwind: '$evaluations'},
                    { $unwind: '$evaluations.answers'},
                    { $addFields: {
                        "evaluations.answers.convertedId": { $toObjectId: "$evaluations.answers.question_id" }
                    }
                    },
                    { $lookup:{
                        from: "questions",
                        localField: "evaluations.answers.convertedId",
                        foreignField: "_id",
                        as: "evaluations.answers.question"
                        }
                    },
                    { $unwind:{path:"$evaluations.answers.question",preserveNullAndEmptyArrays: true}},
                    {
                        $group:{
                            _id:{
                                _id:"$_id",
                                first:"$first",
                                last:"$last",
                                gender:"$gender",
                                division_id:"$division_id",
                                specialty_id:"$specialty_id",
                                type:"$type",
                                e_id:"$evaluations._id",
                                number:"$evaluations.number",
                                session_id:"$evaluations.session_id",
                                started:"$evaluations.started",
                                submitted:"$evaluations.submitted",
                                approved:"$evaluations.approved",
                                additional_notes:"$evaluations.additional_notes",
                                approver_notes:"$evaluations.approver_notes",
                                additional_comment_ids:"$evaluations.additional_comment_ids",
                                approver_comment_ids:"$evaluations.approver_comment_ids",
                            },
                            answers: {$push:"$evaluations.answers"}
                        }
                    },
                    {
                        $sort:{
                            "_id.number":1
                        }
                    },
                    {
                        $group:{
                            _id:{
                                _id:"$_id._id",
                                first:"$_id.first",
                                last:"$_id.last",
                                gender:"$_id.gender",
                                division_id:"$_id.division_id",
                                specialty_id:"$_id.specialty_id",
                                type:"$_id.type",
                                session_id:"$_id.session_id",
                            },
                            evaluations:{$push:{
                                _id:"$_id.e_id",
                                number:"$_id.number",
                                started:"$_id.started",
                                submitted:"$_id.submitted",
                                approved:"$_id.approved",
                                additional_notes:"$_id.additional_notes",
                                approver_notes:"$_id.approver_notes",
                                additional_comment_ids:"$_id.additional_comment_ids",
                                approver_comment_ids:"$_id.approver_comment_ids",
                                answers:"$answers"
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:"$_id._id",
                            session_id:"$_id.session_id",
                            first:"$_id.first",
                            last:"$_id.last",
                            gender:"$_id.gender",
                            division_id:"$_id.division_id",
                            specialty_id:"$_id.specialty_id",
                            type:"$_id.type",
                            evaluations:"$evaluations"
                        }
                    },
                    { $addFields: {
                        "convertedId": { $toObjectId: "$session_id" }
                    }
                    },
                    { $lookup:{
                        from: "sessions",
                        localField: "convertedId",
                        foreignField: "_id",
                        as: "session"
                        }
                    },
                    { $unwind:{path:"$session",preserveNullAndEmptyArrays: true}},
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
                        $group:{
                            _id:"$session",
                            counselors:{$push:"$$ROOT"}
                        }
                    }


                ],(err,result)=>{
                    res.json({success:true,output:result});
                });
                // Camp.aggregate([
                //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                //     { $unwind: '$counselors'},
                //     { $unwind: '$counselors.evaluations'},
                //     { $project: {'counselors':1}},
                //     { $group : { _id : {counselor_id:"$counselors._id",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                //     { $group : { _id:"$_id.s_id",counselors:{$push:{counselor:"$_id.counselor_id",evaluations:"$evaluations"}}}}
                // ],(err,result)=>{
                //     //result = result.slice(0).reverse();
                //     for(let session of result){
                //         session.session = camp.sessions.id(session._id);
                //         for(let counselor of session.counselors){
                //             counselor.counselor = camp.counselors.id(counselor.counselor);
                //             if(counselor.counselor.division){
                //                 counselor.counselor.division = camp.divisions.id(counselor.counselor.division._id);
                //             }
                //             if(counselor.counselor.specialty){
                //                 counselor.counselor.specialty = camp.specialties.id(counselor.counselor.specialty._id);
                //             }
                //         }
                //     }
                //     res.json({success:true,output:result});
                // });
            }
            else{
            var userType = user.type.type;
            if(userType == "leader"){
                Counselor.aggregate([
                    { $match: {camp_id:req.decoded.campId.toString()}},
                    { $unwind: '$session_ids'},
                    {
                        $redact: {
                          $cond: {
                            if: {$eq: [ "$session_ids",current_session._id.toString()]}, 
                            then: "$$KEEP",
                            else: "$$PRUNE"
                            },
                        }
                    },
                    { $unwind: '$evaluations'},
                    {
                        $redact: {
                          $cond: {
                            if: {$eq: [ "$evaluations.session_id",current_session._id.toString()]}, 
                            then: "$$KEEP",
                            else: "$$PRUNE"
                            },
                        }
                    },
                    { $unwind: '$evaluations.answers'},
                    { $addFields: {
                        "evaluations.answers.convertedId": { $toObjectId: "$evaluations.answers.question_id" }
                    }
                    },
                    { $lookup:{
                        from: "questions",
                        localField: "evaluations.answers.convertedId",
                        foreignField: "_id",
                        as: "evaluations.answers.question"
                        }
                    },
                    { $unwind:{path:"$evaluations.answers.question",preserveNullAndEmptyArrays: true}},
                    {
                        $group:{
                            _id:{
                                _id:"$_id",
                                first:"$first",
                                last:"$last",
                                gender:"$gender",
                                division_id:"$division_id",
                                specialty_id:"$specialty_id",
                                type:"$type",
                                e_id:"$evaluations._id",
                                number:"$evaluations.number",
                                session:"$evaluations.session",
                                started:"$evaluations.started",
                                submitted:"$evaluations.submitted",
                                approved:"$evaluations.approved",
                                additional_notes:"$evaluations.additional_notes",
                                approver_notes:"$evaluations.approver_notes",
                                additional_comment_ids:"$evaluations.additional_comment_ids",
                                approver_comment_ids:"$evaluations.approver_comment_ids",
                            },
                            answers: {$push:"$evaluations.answers"}
                        }
                    },
                    {
                        $sort:{
                            "_id.number":1
                        }
                    },
                    {
                        $group:{
                            _id:{
                                _id:"$_id._id",
                                first:"$_id.first",
                                last:"$_id.last",
                                gender:"$_id.gender",
                                division_id:"$_id.division_id",
                                specialty_id:"$_id.specialty_id",
                                type:"$_id.type"
                            },
                            evaluations:{$push:{
                                _id:"$_id.e_id",
                                number:"$_id.number",
                                session:"$_id.session",
                                started:"$_id.started",
                                submitted:"$_id.submitted",
                                approved:"$_id.approved",
                                additional_notes:"$_id.additional_notes",
                                approver_notes:"$_id.approver_notes",
                                additional_comment_ids:"$_id.additional_comment_ids",
                                approver_comment_ids:"$_id.approver_comment_ids",
                                answers:"$answers"
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:"$_id._id",
                            first:"$_id.first",
                            last:"$_id.last",
                            gender:"$_id.gender",
                            division_id:"$_id.division_id",
                            specialty_id:"$_id.specialty_id",
                            type:"$_id.type",
                            evaluations:"$evaluations"
                        }
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
                    // {
                    //     $addFields: {
                    //         d_id: { $toObjectId: "$specialty_id" }
                    //     }
                    // },
                    // { $lookup:{
                    //     from: "specialties",
                    //     localField: "d_id",
                    //     foreignField: "_id",
                    //     as: "specialty"
                    // }},
                    // {
                    //     $unwind:'$specialty'
                    // },


                ],(err,result)=>{
                    res.json({success:true,output:result});
                });
                
            }
            else{
                Counselor.aggregate([
                    { $match: {camp_id:req.decoded.campId.toString()}},
                    { $unwind: '$session_ids'},
                    {
                        $redact: {
                          $cond: {
                            if: {$eq: [ "$session_ids",current_session._id.toString()]}, 
                            then: "$$KEEP",
                            else: "$$PRUNE"
                            },
                        }
                    },
                    { $unwind: '$evaluations'},
                    { $unwind: '$evaluations.answers'},
                    { $addFields: {
                        "evaluations.answers.convertedId": { $toObjectId: "$evaluations.answers.question_id" }
                    }
                    },
                    { $lookup:{
                        from: "questions",
                        localField: "evaluations.answers.convertedId",
                        foreignField: "_id",
                        as: "evaluations.answers.question"
                        }
                    },
                    { $unwind:{path:"$evaluations.answers.question",preserveNullAndEmptyArrays: true}},
                    {
                        $group:{
                            _id:{
                                _id:"$_id",
                                first:"$first",
                                last:"$last",
                                gender:"$gender",
                                division_id:"$division_id",
                                specialty_id:"$specialty_id",
                                type:"$type",
                                e_id:"$evaluations._id",
                                number:"$evaluations.number",
                                session:"$evaluations.session",
                                started:"$evaluations.started",
                                submitted:"$evaluations.submitted",
                                approved:"$evaluations.approved",
                                additional_notes:"$evaluations.additional_notes",
                                approver_notes:"$evaluations.approver_notes",
                                additional_comment_ids:"$evaluations.additional_comment_ids",
                                approver_comment_ids:"$evaluations.approver_comment_ids",
                            },
                            answers: {$push:"$evaluations.answers"}
                        }
                    },
                    {
                        $sort:{
                            "_id.number":1
                        }
                    },
                    {
                        $group:{
                            _id:{
                                _id:"$_id._id",
                                first:"$_id.first",
                                last:"$_id.last",
                                gender:"$_id.gender",
                                division_id:"$_id.division_id",
                                specialty_id:"$_id.specialty_id",
                                type:"$_id.type"
                            },
                            evaluations:{$push:{
                                _id:"$_id.e_id",
                                number:"$_id.number",
                                session:"$_id.session",
                                started:"$_id.started",
                                submitted:"$_id.submitted",
                                approved:"$_id.approved",
                                additional_notes:"$_id.additional_notes",
                                approver_notes:"$_id.approver_notes",
                                additional_comment_ids:"$_id.additional_comment_ids",
                                approver_comment_ids:"$_id.approver_comment_ids",
                                answers:"$answers"
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            _id:"$_id._id",
                            first:"$_id.first",
                            last:"$_id.last",
                            gender:"$_id.gender",
                            division_id:"$_id.division_id",
                            specialty_id:"$_id.specialty_id",
                            type:"$_id.type",
                            evaluations:"$evaluations"
                        }
                    },
                    // {
                    //     $addFields: {
                    //         d_id: { $toObjectId: "$division_id" }
                    //     }
                    // },
                    // { $lookup:{
                    //     from: "divisions",
                    //     localField: "d_id",
                    //     foreignField: "_id",
                    //     as: "division"
                    // }},
                    // {
                    //     $unwind:'$specialty'
                    // },
                    {
                        $addFields: {
                            d_id: { $toObjectId: "$specialty_id" }
                        }
                    },
                    { $lookup:{
                        from: "specialties",
                        localField: "d_id",
                        foreignField: "_id",
                        as: "specialty"
                    }},
                    {
                        $unwind:'$specialty'
                    },


                ],(err,result)=>{
                    res.json({success:true,output:result});
                });
                // console.log("**");
                // Camp.aggregate([
                //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                //     { $unwind: '$counselors'},
                //     { $unwind: '$counselors.evaluations'},
                //     { $project: {'counselors':1}},
                //     { $group : { _id : {counselor_id:"$counselors._id",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                //     { $match : {"_id.s_id":current_session._id}},
                // ],(err,result)=>{
                //     Camp.findById(req.decoded.campId,(err,camp)=>{
                //         result.forEach((counselor)=>{
                //             counselor._id.counselor = camp.counselors.id(counselor._id.counselor_id);
                //             if(counselor._id.counselor.specialty){
                //                 counselor._id.counselor.specialty = camp.specialties.id(counselor._id.counselor.specialty._id);
                //             }
                //         });
                //         res.json({success:true,output:result});
                //     });
                    
                // });
            }
        }
        });
    });

    router.get('/get_eval/:counselorId/:evaluationId/:type',async function(req,res){
        userType = req.params.type?req.params.type: await User.findById(req.decoded.userId).type;
        Counselor.aggregate(
            [
                { $match: {_id:req.params.counselorId}},
                { $unwind: "$evaluations"},
                { $match: {"evaluations._id":mongoose.Types.ObjectId(req.params.evaluationId)}},
                { $unwind: "$evaluations.answers"},
                { $addFields: {
                    "evaluations.answers.convertedId": { $toObjectId: "$evaluations.answers.question_id" }
                }
                },
                { $lookup:{
                    from: "questions",
                    localField: "evaluations.answers.convertedId",
                    foreignField: "_id",
                    as: "evaluations.answers.question"
                    }
                },
                { $unwind:{path:"$evaluations.answers.question",preserveNullAndEmptyArrays: true}},
                { $match: {"evaluations.answers.question.byWho.type":userType}},
                {
                    $group:{
                        _id:{
                            _id:"$_id",
                            first:"$first",
                            last:"$last",
                            gender:"$gender",
                            division_id:"$division_id",
                            specialty_id:"$specialty_id",
                            type:"$type",
                            e_id:"$evaluations._id",
                            number:"$evaluations.number",
                            session_id:"$evaluations.session_id",
                            started:"$evaluations.started",
                            submitted:"$evaluations.submitted",
                            approved:"$evaluations.approved",
                            additional_notes:"$evaluations.additional_notes",
                            approver_notes:"$evaluations.approver_notes",
                            additional_comment_ids:"$evaluations.additional_comment_ids",
                            approver_comment_ids:"$evaluations.approver_comment_ids",
                        },
                        answers: {$push:"$evaluations.answers"}
                    }
                },
                {
                    $project:{
                        _id:"$_id._id",
                        first:"$_id.first",
                        last:"$_id.last",
                        gender:"$_id.gender",
                        division_id:"$_id.division_id",
                        specialty_id:"$_id.specialty_id",
                        type:"$_id.type",
                        evaluation:{
                            _id:"$_id.e_id",
                            number:"$_id.number",
                            session_id:"$_id.session_id",
                            started:"$_id.started",
                            submitted:"$_id.submitted",
                            approved:"$_id.approved",
                            additional_notes:"$_id.additional_notes",
                            approver_notes:"$_id.approver_notes",
                            additional_comment_ids:"$_id.additional_comment_ids",
                            approver_comment_ids:"$_id.approver_comment_ids",
                            answers:"$answers"
                        }

                    }
                },
                { $addFields: {
                    "evaluation.convertedId": { $toObjectId: "$evaluation.session_id" }
                }
                },
                { $lookup:{
                    from: "sessions",
                    localField: "evaluation.convertedId",
                    foreignField: "_id",
                    as: "evaluation.session"
                    }
                },
                { $unwind:{path:"$evaluation.session",preserveNullAndEmptyArrays: true}},

            ],
            (err,counselor)=>{
                result = {
                                evaluation:counselor[0].evaluation,
                                counselor:counselor[0]
                            }
                            res.json({success:true, evaluation:result});
            }
        );

    });

    router.post('/save_eval',async function(req,res){
        const u = await User.findById(req.decoded.userId);
        var userType = u.type.type;
        Counselor.findById(req.body.counselor._id,(err,counselor)=>{
            if(userType!="head_specialist"){
                counselor.evaluations.id(req.body.evaluation._id).started = req.body.evaluation.started;
                counselor.evaluations.id(req.body.evaluation._id).submitted = req.body.evaluation.submitted;
                counselor.evaluations.id(req.body.evaluation._id).approved = req.body.evaluation.approved;
            }
            counselor.evaluations.id(req.body.evaluation._id).additional_notes = req.body.evaluation.additional_notes;
            counselor.evaluations.id(req.body.evaluation._id).approver_notes = req.body.evaluation.approver_notes;
            for(let answer of req.body.evaluation.answers){
                counselor.evaluations.id(req.body.evaluation._id).answers.id(answer._id).numerical = answer.numerical;
                counselor.evaluations.id(req.body.evaluation._id).answers.id(answer._id).text = answer.text;
            }
            
            //started,submitted, additional notes;
            counselor.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/add_approver_division',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Division.update({_id:req.body._id},{$push:{approver_ids:toAdd._id.toString()}},(err,camp)=>{
            res.json({success:true});
        })
    });

    router.post('/remove_approver_division',(req,res) => {
        Division.update({_id:req.body.division_id},{$pull:{approver_ids:req.body.leader_id.toString()}},(err,camp)=>{
            res.json({success:true});
        })
    });

    router.get('/is_approver/',(req,res)=>{
        Division.aggregate([
            {
                $redact: {
                  $cond: {
                    if: {$in: [ req.decoded.userId.toString(),"$approver_ids"]}, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            },
        ],(err,result)=>{
            res.json({success:true,approver:result.length!=0});
        });
    });

    router.get('/is_eval_approver/:counselorId',(req,res)=>{
        Counselor.aggregate([
            { $match: {_id:req.params.counselorId}},
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
            { $replaceRoot:{newRoot:"$division"}},
            {
                $redact: {
                  $cond: {
                    if: {$in: [ req.decoded.userId.toString(),"$approver_ids"]}, 
                    then: "$$KEEP",
                    else: "$$PRUNE"
                    },
                }
            }
        ],
        (err,result)=>{
            res.json({success:true,approver:result.length!=0});
        }
        );

    });

    router.post('/change_gold',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            camp.options.evaluationOpts.gold = req.body.newGold;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/change_silver',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            camp.options.evaluationOpts.silver = req.body.newSilver;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/change_green',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            camp.options.evaluationOpts.green = req.body.newGreen;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/create_comment',(req,res)=> {
        Counselor.findById(req.body.counselor_id, async function(err,counselor){
            var user = await User.findById(req.decoded.userId);
            req.body.comment.commenter = user.first + " " + user.last; 
            comment = new EvaluationComment(req.body.comment);
            comment.save();
            console.log(req.body.answer_id);
            if(req.body.answer_id=="additional"){
                counselor.evaluations.id(req.body.evaluation_id).additional_comment_ids.push(comment._id.toString());
            }
            else if(req.body.answer_id=="approver"){
                counselor.evaluations.id(req.body.evaluation_id).approver_comment_ids.push(comment._id.toString());
            }
            else{
                var answer = counselor.evaluations.id(req.body.evaluation_id).answers.id(req.body.answer_id);
                answer.comment_ids.push(comment._id.toString());
            }
            counselor.save({validateBeforeSave:false});
            res.json({success:true,comment_id:comment._id.toString()});
        });
    });

    router.post('/populate_comments', async function(req,res) {
        console.log(req.body);
        var comments = await EvaluationComment.find({_id:{$in:req.body}}).sort({type:1});
        console.log(comments);
        res.json({success:true,comments:comments});
    });

    router.post('/delete_comment', async function(req,res) {
        await EvaluationComment.findByIdAndRemove(req.body.comment_id);
        Counselor.findById(req.body.counselor_id, async function(err,counselor){
            if(req.body.answer_id=="additional"){
                var additional_comment_ids = counselor.evaluations.id(req.body.evaluation_id).additional_comment_ids;
                var spliceIndex = additional_comment_ids.indexOf(req.body.comment_id);
                additional_comment_ids.splice(spliceIndex,1);
            }
            else if(req.body.answer_id=="approver"){
                console.log("hellow orld");
                var approver_comment_ids = counselor.evaluations.id(req.body.evaluation_id).approver_comment_ids;
                var spliceIndex = approver_comment_ids.indexOf(req.body.comment_id);
                approver_comment_ids.splice(spliceIndex,1);
            }
            else{
                var answer = counselor.evaluations.id(req.body.evaluation_id).answers.id(req.body.answer_id);
                var spliceIndex = answer.comment_ids.indexOf(req.body.comment_id);
                answer.comment_ids.splice(spliceIndex,1);
            }

            counselor.save({validateBeforeSave:false});
            res.json({success:true});
        });

    });

    return router;
}