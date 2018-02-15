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

    return router;
}