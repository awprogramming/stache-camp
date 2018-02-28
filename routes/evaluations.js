const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

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
                camp.counselors.forEach((counselor)=>{
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
                });
                camp.save({ validateBeforeSave: false })
                res.json({success:true});
            }
        });
    });

    router.get('/get_all_current/',(req,res)=>{
        Camp.findById(req.decoded.campId).exec().then((camp)=>{
            const current_session = camp.options.session;
            var type;
            var userType = camp.users.id(req.decoded.userId).type.type;
            if(userType == "Leader"){
                Camp.aggregate([
                    { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                    { $unwind: '$counselors'},
                    { $unwind: '$counselors.evaluations'},
                    { $project: {'counselors':1}},
                    { $group : { _id : {counselor:"$counselors",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                    { $match : {"_id.s_id":current_session._id}},
                ],(err,result)=>{
                    result.forEach((counselor)=>{
                        if(counselor._id.counselor.division){
                            counselor._id.counselor.division = camp.divisions.id(counselor._id.counselor.division._id);
                        }
                    });
                    res.json({success:true,output:result});
                });
            }
            else{
                Camp.aggregate([
                    { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                    { $unwind: '$counselors'},
                    { $unwind: '$counselors.evaluations'},
                    { $project: {'counselors':1}},
                    { $group : { _id : {counselor:"$counselors",s_id:"$counselors.evaluations.session._id",s_name:"$counselors.evaluations.session.name"},  evaluations:{$push:"$counselors.evaluations"}}},
                    { $match : {"_id.s_id":current_session._id}},
                ],(err,result)=>{
                    result.forEach((counselor)=>{
                        if(counselor._id.counselor.specialty){
                            counselor._id.counselor.specialty = camp.specialties.id(counselor._id.counselor.specialty._id);
                        }
                    });
                    res.json({success:true,output:result});
                });
            }
        });
    });

    router.get('/get_eval/:counselorId/:evaluationId',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                evaluation = camp.counselors.id(req.params.counselorId).evaluations.id(req.params.evaluationId);
                userType = camp.users.id(req.decoded.userId).type;
                answers = []
                for(let answer of evaluation.answers){
                    if(answer.question.byWho.equals(userType))
                        answers.push(answer);
                }   
                evaluation.answers = answers;
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
            camp.counselors.id(req.body.counselor._id).evaluations.pull(req.body.evaluation._id);
            camp.counselors.id(req.body.counselor._id).evaluations.push(req.body.evaluation);
            camp.save({ validateBeforeSave: false });
            res.json({success:true});
        });

    });

    return router;
}