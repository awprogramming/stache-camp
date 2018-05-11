const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const json2csv = require('json2csv');

module.exports = (router) => {
    // router.get('/all_camps',(req,res) =>{
    //     Camp.find({},(err,camps) => {
    //         if(err){
    //             res.json({success:false,message:err});
    //         }
    //         else{
    //             if(!camps){
    //                 res.json({success:false, message:'No camp registered'})
    //             }
    //             else{
    //                res.json({success:true,camps:camps});
    //             }
    //         }
    //     }).sort({'name':1})
    // });

    router.get('/all_questions',(req,res)=>{
        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$options.evaluationOpts.questions'},
            { $project: {"options.evaluationOpts.questions":1}},
            { $group : { _id : {type:"$options.evaluationOpts.questions.type"}, questions:{$push:"$options.evaluationOpts.questions"}}},
            
        ],(err,result)=>{
            res.json({success:true,types:result});
        });
    });
    
    
    router.post('/register_question',(req,res) =>{

        Camp.update({"_id":req.decoded.campId},{$push:{"options.evaluationOpts.questions":req.body}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });
    
    router.delete('/remove_question/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{"options.evaluationOpts.questions":{_id:req.params.id}}},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Question deleted!' }); 
                }
            });
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

    router.post('/change_period',(req,res) =>{
        Camp.findByIdAndUpdate(req.decoded.campId,{"options.evaluationOpts.currentEval":req.body.period},{new:true}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.options.evaluationOpts.currentEval > camp.options.evaluationOpts.furthestReached){
                    camp.options.evaluationOpts.furthestReached = camp.options.evaluationOpts.currentEval;
                    camp.counselors.forEach((counselor)=>{
                        for(let session of counselor.sessions){
                            if(session._id.equals(camp.options.session._id)){
                                const evaluation = counselor.evaluations.create({
                                    number: camp.options.evaluationOpts.currentEval,
                                    session: camp.options.session,
                                    started: false,
                                    submitted: false,
                                    approved: false,
                                    answers: []
                                });
                                const answers = []
                                var prevAnswers;
                                if(camp.options.evaluationOpts.currentEval!=1){
                                    for(let e of counselor.evaluations){
                                        if(e.number == camp.options.evaluationOpts.currentEval-1 && e.session._id.equals(camp.options.session._id)){
                                            for(let a of e.answers){
                                                const answer = {
                                                    question:a.question,
                                                    numerical:a.numerical
                                                };
                                                evaluation.answers.create(answer);
                                                evaluation.answers.push(answer);
                                            }
                                            break;
                                        }
                                    }
                                }
                                else{
                                    for(let question of camp.options.evaluationOpts.questions){
                                        if(question.type._id.equals(counselor.type._id)){
                                            const answer = {
                                                question:question
                                            };
                                            evaluation.answers.create(answer);
                                            evaluation.answers.push(answer);
                                        }
                                    }
                                }
                                counselor.evaluations.push(evaluation);
                            }
                        }
                    });
                    camp.save({ validateBeforeSave: false })
                }
                res.json({success:true});
            }
        });
    });

    router.get('/get_all_current/',(req,res)=>{
        Camp.findById(req.decoded.campId).exec().then((camp)=>{
            const current_session = camp.options.session;
            var type;
            if(camp.admin._id == req.decoded.userId){
                Camp.aggregate([
                    { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                    { $unwind: '$counselors'},
                    { $unwind: '$counselors.evaluations'},
                    { $project: {'counselors':1}},
                    { $group : { _id : {counselor_id:"$counselors._id",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                    { $group : { _id:"$_id.s_id",counselors:{$push:{counselor:"$_id.counselor_id",evaluations:"$evaluations"}}}}
                ],(err,result)=>{
                    result = result.slice(0).reverse();
                    for(let session of result){
                        session.session = camp.sessions.id(session._id);
                        for(let counselor of session.counselors){
                            counselor.counselor = camp.counselors.id(counselor.counselor);
                            if(counselor.counselor.division){
                                counselor.counselor.division = camp.divisions.id(counselor.counselor.division._id);
                            }
                            if(counselor.counselor.specialty){
                                counselor.counselor.specialty = camp.specialties.id(counselor.counselor.specialty._id);
                            }
                        }
                    }
                    res.json({success:true,output:result});
                });
                // Camp.aggregate([
                //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                //     { $unwind: '$counselors'},
                //     { $unwind: '$counselors.evaluations'},
                //     { $project: {'counselors':1}},
                //     { $group : { _id : {counselor_id:"$counselors._id",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                //     { $group : { _id:"$_id.counselor_id",sessions:{$push:{s_id:"$_id.s_id",s_name:"$_id.s_name",evaluations:"$evaluations"}}}}
                // ],(err,result)=>{
                //     for(let counselor of result){
                //         counselor._id.counselor = camp.counselors.id(counselor._id);
                //         if(counselor._id.counselor.division){
                //             counselor._id.counselor.division = camp.divisions.id(counselor._id.counselor.division._id);
                //         }
                //         if(counselor._id.counselor.specialty){
                //             counselor._id.counselor.specialty = camp.specialties.id(counselor._id.counselor.specialty._id);
                //         }
                //     }
                //     res.json({success:true,output:result});
                // });
            }
            else{
            var userType = camp.users.id(req.decoded.userId).type.type;
            if(userType == "leader"){
                Camp.aggregate([
                    { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                    { $unwind: '$counselors'},
                    { $unwind: '$counselors.evaluations'},
                    { $project: {'counselors':1}},
                    { $group : { _id : {counselor_id:"$counselors._id",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                    { $match : {"_id.s_id":current_session._id}},
                ],(err,result)=>{
                    Camp.findById(req.decoded.campId,(err,camp)=>{
                        result.forEach((counselor)=>{
                            counselor._id.counselor = camp.counselors.id(counselor._id.counselor_id);
                            if(counselor._id.counselor.division){
                                counselor._id.counselor.division = camp.divisions.id(counselor._id.counselor.division._id);
                            }
                        });
                        res.json({success:true,output:result});
                    });
                });
            }
            else{
                Camp.aggregate([
                    { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                    { $unwind: '$counselors'},
                    { $unwind: '$counselors.evaluations'},
                    { $project: {'counselors':1}},
                    { $group : { _id : {counselor_id:"$counselors._id",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                    { $match : {"_id.s_id":current_session._id}},
                ],(err,result)=>{
                    Camp.findById(req.decoded.campId,(err,camp)=>{
                        result.forEach((counselor)=>{
                            counselor._id.counselor = camp.counselors.id(counselor._id.counselor_id);
                            if(counselor._id.counselor.specialty){
                                counselor._id.counselor.specialty = camp.specialties.id(counselor._id.counselor.specialty._id);
                            }
                        });
                        res.json({success:true,output:result});
                    });
                    
                });
            }
        }
        });
    });

    router.get('/get_eval/:counselorId/:evaluationId/:type',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                evaluation = camp.counselors.id(req.params.counselorId).evaluations.id(req.params.evaluationId);
                
                userType = req.params.type?req.params.type:camp.users.id(req.decoded.userId).type;
                if(camp.admin._id != req.decoded.userId){
                    answers = []
                    for(let answer of evaluation.answers){
                        if(answer.question.byWho.type==userType)
                            answers.push(answer);
                    }   
                    evaluation.answers = answers;
                }
                else{
                    answers = []
                    for(let answer of evaluation.answers){
                        if(answer.question.byWho.type == userType)
                            answers.push(answer);
                    }   
                    evaluation.answers = answers;
                }
                // evaluation.counselor = camp.counselors.id(req.params.counselorId);
                result = {
                    evaluation:evaluation,
                    counselor:camp.counselors.id(req.params.counselorId)
                }
                res.json({success:true, evaluation:result});
            }
        });
    });

    router.post('/save_eval',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            camp.counselors.id(req.body.counselor._id).evaluations.id(req.body.evaluation._id).started = req.body.evaluation.started;
            camp.counselors.id(req.body.counselor._id).evaluations.id(req.body.evaluation._id).submitted = req.body.evaluation.submitted;
            camp.counselors.id(req.body.counselor._id).evaluations.id(req.body.evaluation._id).approved = req.body.evaluation.approved;
            camp.counselors.id(req.body.counselor._id).evaluations.id(req.body.evaluation._id).additional_notes = req.body.evaluation.additional_notes;
            for(let answer of req.body.evaluation.answers){
                camp.counselors.id(req.body.counselor._id).evaluations.id(req.body.evaluation._id).answers.pull(answer._id);
                camp.counselors.id(req.body.counselor._id).evaluations.id(req.body.evaluation._id).answers.push(answer);

            }
            //started,submitted, additional notes;
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });
    });

    router.post('/add_approver_division',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body._id}}},{$push:{"divisions.$.approvers":toAdd}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.post('/remove_approver_division',(req,res) => {
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body.division_id}}},{$pull:{"divisions.$.approvers":{_id:req.body.leader_id}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.get('/is_approver',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var approver = false;

            for(let division of camp.divisions){
                if(division.approvers && division.approvers.id(req.decoded.userId)){
                    approver = true;
                    break;
                }
            }
            
            res.json({success:true,approver:approver});
        });
    });

    return router;
}