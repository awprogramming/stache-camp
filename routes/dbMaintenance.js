const Camp = require('../models/camp');
const Camper = require('../models/camper');
const Counselor = require('../models/counselor');
const Specialty = require('../models/specialty');
const Roster = require('../models/roster');
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');


module.exports = (router) => {
    router.get('/transfer_campers',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$campers"
            },
            {
               $addFields:{"campers.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$campers"}
            },
            {
                $addFields:{"division_id":{ $toString: "$division._id" }}  
            },
            {
                $project:{
                    division:0
                }
            },
            {
                $unwind:{path:"$sessions",preserveNullAndEmptyArrays: true}
            },
            {
                $group:{_id:{_id:"$_id",first:"$first",last:"$last",gender:"$gender",camp_id:"$camp_id",division_id:"$division_id",meds:"$meds",dietary:"$dietary",cSwimOpts:"$cSwimOpts",weeksEnrolledNS:"$weeksEnrolledNS",p1Name:"$p1Name",p1Email:"$p1Email",p2Name:"$p2Name",p2Email:"$p2Email",},session_ids:{$push:{$toString:"$sessions._id"}}}
            },
            {
                $project:{
                    _id:"$_id._id",
                    first:"$_id.first",
                    last:"$_id.last",
                    gender:"$_id.gender",
                    camp_id:"$_id.camp_id",
                    division_id:"$_id.division_id",
                    meds:"$_id.meds",
                    dietary:"$_id.dietary",
                    cSwimOpts:"$_id.cSwimOpts",
                    weeksEnrolledNS:"$_id.weeksEnrolledNS",
                    p1Name:"$_id.p1Name",
                    p1Email:"$_id.p1Email",
                    p2Name:"$_id.p2Name",
                    p2Email:"$_id.p2Email",
                    session_ids:"$session_ids"
                }
            },
            {
                $out:"campers"
            }
            ],
            function(err) {  
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto campers!") 
            });
    });

    router.get('/transfer_divisions',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$divisions"
            },
            {
               $addFields:{"divisions.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$divisions"}
            },
            {
                $unwind:{path:"$leaders",preserveNullAndEmptyArrays: true}
            },
            {
                $group:{_id:{_id:"$_id",name:"$name",camp_id:"$camp_id",approvers:"$approvers",gender:"$gender"},leader_ids:{$push:{$toString:"$leaders._id"}}}
            },
            {
                $project:{
                    _id:"$_id._id",
                    name:"$_id.name",
                    camp_id:"$_id.camp_id",
                    approvers:"$_id.approvers",
                    gender:{ $toLower: "$_id.gender" },
                    leader_ids:"$leader_ids"
                }
            },
            {
                $unwind:{path:"$approvers",preserveNullAndEmptyArrays: true}
            },
            {
                $group:{_id:{_id:"$_id",name:"$name",camp_id:"$camp_id",leader_ids:"$leader_ids",gender:"$gender"},approver_ids:{$push:{$toString:"$approvers._id"}}}
            },
            {
                $project:{
                    _id:"$_id._id",
                    name:"$_id.name",
                    camp_id:"$_id.camp_id",
                    gender:"$_id.gender",
                    leader_ids:"$_id.leader_ids",
                    approver_ids:"$approver_ids"
                }
            },
            {
                $addFields:{"leaders":[],"approvers":[]}  
             },
            {
                $out:"divisions"
            }
            ],
            function(err,result) { 
                console.log(result); 
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto divisions!") 
            });
    });

    router.get('/transfer_specialties',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$specialties"
            },
            {
               $addFields:{"specialties.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$specialties"}
            },
            {
                $unwind:{path:"$head_specialists",preserveNullAndEmptyArrays: true}
            },
            {
                $group:{_id:{_id:"$_id",name:"$name",camp_id:"$camp_id",rosters:"$rosters"},head_specialist_ids:{$push:{$toString:"$head_specialists._id"}}}
            },
            {
                $project:{
                    _id:"$_id._id",
                    name:"$_id.name",
                    camp_id:"$_id.camp_id",
                    rosters:"$_id.rosters",
                    head_specialist_ids:"$head_specialist_ids"
                }
            },
            {
                $out:"specialties"
            }
            ],
            function(err,result) { 
                console.log(result); 
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto specialties!") 
            });
    });

    router.get('/transfer_counselors',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$counselors"
            },
            {
               $addFields:{"counselors.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$counselors"}
            },
            {
                $addFields:{"division_id":{ $toString: "$division._id" },"specialty_id":{ $toString: "$specialty._id" }}  
            },
            {
                $unwind:{path:"$sessions",preserveNullAndEmptyArrays: true}
            },
            {
                $group:{_id:{_id:"$_id",first:"$first",last:"$last",gender:"$gender",camp_id:"$camp_id",division_id:"$division_id",specialty_id:"$specialty_id",type:"$type",evaluations:"$evaluations"},session_ids:{$push:{$toString:"$sessions._id"}}}
            },
            {
                $project:{
                    _id:"$_id._id",
                    first:"$_id.first",
                    last:"$_id.last",
                    gender:"$_id.gender",
                    camp_id:"$_id.camp_id",
                    division_id:"$_id.division_id",
                    specialty_id:"$_id.specialty_id",
                    type:"$_id.type",
                    evaluations:"$_id.evaluations",
                    session_ids:"$session_ids"
                }
            },
            {
                $out:"counselors"
            }
            ],
            function(err) {  
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto counselors!") 
            });
    });

    router.get('/transfer_users',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$users"
            },
            {
               $addFields:{"users.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$users"}
            },
            {
                $out:"users"
            }
            ],
            function(err,result) {  
                for(let user of result)
                    console.log(user.email)
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto counselors!") 
            });
    });

    router.get('/transfer_sessions',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$sessions"
            },
            {
               $addFields:{"sessions.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$sessions"}
            },
            {
                $out:"sessions"
            }
            ],
            function(err,result) {  
                for(let user of result)
                    console.log(user.email)
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto sessions!") 
            });
    });

    router.get('/efficient_answers',(req,res) =>{
        // Counselor.update({ evaluations: { $exists: true, $not: {$size: 0}}},{ $set: { "evaluations.$[].answers.$[].evaluation_id": "test" } },(err,counselors)=>{
        //     console.log(err,counselors);
        Counselor.find({ evaluations: { $exists: true, $not: {$size: 0}}},(err,counselors)=>{
            for(let counselor of counselors){
                for(let evaluation of counselor.evaluations){
                    for(let answer of evaluation.answers){
                        answer['question_id'] = answer.question._id.toString();
                        answer.question = undefined;
                    }
                }
                counselor.save({ validateBeforeSave: false },(err)=>{
                    console.log(err);
                });
            }
            
        });
    });

    router.get('/sess_to_id',(req,res) =>{
        // Counselor.update({ evaluations: { $exists: true, $not: {$size: 0}}},{ $set: { "evaluations.$[].answers.$[].evaluation_id": "test" } },(err,counselors)=>{
        //     console.log(err,counselors);
        Counselor.find({ evaluations: { $exists: true, $not: {$size: 0}}},(err,counselors)=>{
            for(let counselor of counselors){
                for(let evaluation of counselor.evaluations){
                    if(evaluation.session){
                        evaluation['session_id'] = evaluation.session._id;
                        evaluation.session = undefined;
                    }
                }
                counselor.save({ validateBeforeSave: false },(err)=>{
                    console.log(err);
                });
            }
            
        });
    });

    router.get('/ros_sess_to_id',(req,res) =>{
        console.log("hello world");
        Specialty.find({ rosters: { $exists: true, $not: {$size: 0}}},(err,specialties)=>{
            for(let specialty of specialties){
                for(let roster of specialty.rosters){
                    if(roster.toObject().session){
                        roster['session_id'] = roster.toObject().session._id;
                        roster.toObject().session = undefined;
                        console.log(roster);
                    }
                }
                specialty.save({ validateBeforeSave: false },(err)=>{
                    console.log(err);
                });
            }
            
        });
    });

    router.get('/transfer_rosters', async function(req,res){
        
        // Roster.updateMany({}, { $rename: { 'campers': 'camper_ids'}});
        //specialties backup in Documents folder

        // await Specialty.find({ rosters: { $exists: true, $not: {$size: 0}}},(err,specialties)=>{
        //     console.log(specialties);
        //     for(let specialty of specialties){
        //         roster_ids = [];
        //         for(let roster of specialty.rosters)
        //             roster_ids.push(roster._id.toString())
        //         specialty.roster_ids = roster_ids;
        //         specialty.save({ validateBeforeSave: false });
        //     }
        // });

        // await Specialty.aggregate([
        //     {
        //         $unwind:"$rosters"
        //     },
        //     {
        //        $addFields:{"rosters.specialty_id":{ $toString: "$_id" }}  
        //     },
        //     {
        //         $replaceRoot: {newRoot: "$rosters"}
        //     },
        //     {
        //         $addFields:{"camper_ids":"$campers"}  
        //     },
        //     {
        //         $project:{
        //             "campers":false
        //         }
        //     },
        //     {
        //         $out:"rosters"
        //     }
        //     ],
        //     function(err,result) {
        //         if (err) console.log("error: ", err) 
        //         else console.log("the all documents have been written onto rosters!") 
        //     });
        
        Specialty.find({},(err,specialties)=>{
            for(let specialty of specialties){
                specialty.rosters = undefined;
                specialty.save({ validateBeforeSave: false });
            }
        })
    });

    router.get('/transfer_questions',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$options.evaluationOpts.questions"
            },
            {
               $addFields:{"options.evaluationOpts.questions.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$options.evaluationOpts.questions"}
            },
            {
                $out:"questions"
            }
            ],
            function(err,result) { 
                console.log(result); 
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto questions!") 
            });
            
    });

    router.get('/transfer_swim_groups',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$swimGroups"
            },
            {
               $addFields:{"swimGroups.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$swimGroups"}
            },
            {
                $addFields:{"session_id":"$sessionId"}  
            },
            {
                $addFields:{"camper_ids":"$camperIds"}  
            },
            {
                $addFields:{"lifeguard_id":"$lifeguardId"}  
            },
            {
                $project:{
                    sessionId:0,
                    camperIds:0,
                    lifeguardId:0
                }
            },
            {
                $out:"swimGroups"
            }
            ],
            function(err,result) { 
                console.log(result); 
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto questions!") 
            });
    });
    

    router.get('/transfer_swim_levels',(req,res) =>{
        Camp.aggregate([
            {
                $unwind:"$options.swimOpts.swimLevels"
            },
            {
               $addFields:{"options.swimOpts.swimLevels.camp_id":{ $toString: "$_id" }}  
            },
            {
                $replaceRoot: {newRoot: "$options.swimOpts.swimLevels"}
            },
            {
                $out:"swimlevels"
            }
            ],
            function(err,result) { 
                console.log(result); 
                if (err) console.log("error: ", err) 
                else console.log("the all documents have been written onto questions!") 
            });
    });

    router.get('/convert_completed',(req,res) =>{
        // Camp.update({"$options.swimOpts": {$exists: true}},{$unset: {"options.swimOpts.completed.$[].camper":true}},(err,camps)=>{
        //     console.log(camps)
        //     if (err) console.log("error: ", err) 
        //     else console.log("converting...") 
        // })
        Camp.find({ "options.swimOpts": { $exists: true}},(err,camps)=>{
            for(let camp of camps){
                for(let completed of camp.options.swimOpts.completed){
                    // completed["camper_id"] = completed.toJSON().camper._id;
                    completed.camper = undefined ;
                    console.log(completed);
                    // console.log(completed);
                }
                camp.save({ validateBeforeSave: false });
            }
            if (err) console.log("error: ", err) 
                else console.log("converting...") 
        });
    });

    router.get('/fl_swap',(req,res) =>{
        //5b05ae44cd4b4c92150b054a TLC
        //5aa04e66018dd5001412907b TLW
        Counselor.find({$or:[{camp_id:"5aa04e66018dd5001412907b"}]},(err,counselors)=>{
            
            for(let counselor of counselors){
                var swap = counselor.first;
                counselor.first = counselor.last;
                counselor.last = swap;
                counselor.save({ validateBeforeSave: false });
                console.log(counselor.first+" "+counselor.last);
            }
        });
    });

    // 5aa04e66018dd5001412907b
    // 5b127c81769b3ace5f901cf2
    router.get('/unset_stuff',(req,res) =>{
        
        Camp.find({},(err,camps)=>{
            for(let camp of camps){
                camp.users = undefined;
                camp.counselors = undefined;
                camp.campers = undefined;
                camp.specialties = undefined;
                camp.divisions = undefined;
                camp.swimGroups = undefined;
                if(camp.options.evaluationOpts && camp.options.evaluationOpts.questions)
                    camp.options.evaluationOpts.questions = undefined;
                if(camp.options.swimOpts && camp.options.swimOpts.swimLevels)
                    camp.options.swimOpts.swimLevels = undefined;
                camp.save({ validateBeforeSave: false });

            }
            if (err) console.log("error: ", err) 
                else console.log("unsetting...") 
        })
    });

    return router;
}