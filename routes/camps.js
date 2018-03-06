const Camp = require('../models/camp');
const User = require('../models/user');
const EvalOpts = require('../models/evalOpts');
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

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
                var type;
                for(let user of camp.users){
                    if(user._id == req.decoded.userId)
                        type = user.type;
                }
                var result = {
                    "type":type,
                    "camp":camp
                }
                return result;
            })
            .then(function(result){
                const camp = result.camp;
                const type = result.type;
                if(result.type.type == "Leader"){
                    var leaderDivisions = [];
                    for(let division of camp.divisions){
                        for(let leader of division.leaders){
                            if(leader._id == req.decoded.userId){
                                leaderDivisions.push(division._id);
                            }
                        }
                    }
                    //res.json({success:true,counselors:leaderDivisions});
                    var result = {
                        "type":type,
                        "ld":leaderDivisions,
                        "camp":camp
                    }
                    return result;
                }
                else{
                    var hsSpecialties = [];
                    for(let specialty of camp.specialties){
                        for(let leader of specialty.head_specialists){
                            if(leader._id == req.decoded.userId){
                                hsSpecialties.push(specialty._id);
                            }
                        }
                    }
                    var result = {
                        "type":type,
                        "hsS":hsSpecialties,
                        "camp":camp
                    }
                    return result;
                }
            })
            .then(function(result){
                if(result.type.type == "Leader"){
                    var leaderDivisions = result.ld;
                    var result = result.camp;
                    var counselors = {};
                    var ctr = 0;
                    var finished = false;
                    for(let counselor of result.counselors){
                        var hired = false;
                        for(let session of counselor.sessions){
                            if(session._id.equals(result.options.session._id)){
                                hired = true;
                                break;
                            }
                        }
                        if(hired){
                            for(let division of leaderDivisions){

                                if(counselor.division && counselor.division._id.equals(division)){
                                    if(!(counselor.division.name in counselors))
                                        counselors[counselor.division.name] = []
                                    counselors[counselor.division.name].push(counselor);
                                }
                            }
                        }
                    }
                    return counselors;
                }
                else{
                    var hsSpecialties = result.hsS;
                    var result = result.camp;
                    var counselors = {};
                    var ctr = 0;
                    var finished = false;
                    for(let counselor of result.counselors){
                        var hired = false;
                        for(let session of counselor.sessions){
                            if(session._id.equals(result.options.session._id)){
                                hired = true;
                                break;
                            }
                        }
                        if(hired){
                            for(let specialty of hsSpecialties){
                                if(counselor.type.type == "specialist" && counselor.specialty && counselor.specialty._id.equals(specialty)){
                                    if(!(counselor.specialty.name in counselors))
                                        counselors[counselor.specialty.name] = []
                                    counselors[counselor.specialty.name].push(counselor);
                                }
                            }
                        }
                    }
                    return counselors;
                }
            })
            .then(function(counselors){
                res.json({success:true,counselors:counselors});
            });
        }
        else{
        Camp.findById(req.decoded.campId).exec().then((camp)=>{
            const current_session = camp.options.session;
            Camp.aggregate([
                { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
                { $unwind: '$counselors'},
                { $unwind: '$counselors.sessions'},
                { $project: {counselors:1}},
                { $group : { _id : {session_id:"$counselors.sessions._id",session_name:"$counselors.sessions.name"}, counselors:{$push:"$counselors"}}},
                
            ],(err,result)=>{
                const output = {
                    "sessions":result,
                    "cur_session":current_session
                }
                res.json({success:true,output:output});
            });
            // Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            //     if(err){
            //         res.json({success:false,message:err});
            //     }
            //     else{
            //         if(!camp.counselors || camp.counselors.length == 0){
            //             res.json({success:false, message:'No Counselors registered'})
            //         }
            //         else{
            //            res.json({success:true,counselors:camp.counselors});
            //         }
            //     }
            // });
        });
        
        }
    });

    router.post('/add_counselor',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            const sessions = [];
            sessions.push(camp.options.session);
            const counselor = req.body;
            counselor.sessions = sessions;
            const newCounselor = camp.counselors.create(counselor);
            for(let mod of camp.modules){
                if(mod.short_name=="eval"){
                    const evaluation = newCounselor.evaluations.create({
                        number: camp.options.evaluationOpts.currentEval,
                        session: camp.options.session,
                        started: false,
                        submitted: false,
                        approved: false,
                        answers: []
                    });
                    const answers = []
                    for(let question of camp.options.evaluationOpts.questions){
                        if(question.type._id.equals(newCounselor.type._id)){
                            const answer = {
                                question:question
                            };
                            evaluation.answers.create(answer);
                            evaluation.answers.push(answer);
                        }
                    }
                    newCounselor.evaluations.push(evaluation);
                    break;
                }
            }
            camp.counselors.push(newCounselor);
            camp.save({ validateBeforeSave: false });
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

    router.post('/bulk_add_counselor/:eval',(req,res) => {

        if(req.params.eval){
            Camp.findById(req.decoded.campId,(err,camp)=>{
                for(let counselor of req.body){
                    const newCounselor = camp.counselors.create(counselor);
                    const evaluation = newCounselor.evaluations.create({
                        number: camp.options.evaluationOpts.currentEval,
                        session: camp.options.session,
                        started: false,
                        submitted: false,
                        approved: false,
                        answers: []
                    });
                    const answers = []
                    for(let question of camp.options.evaluationOpts.questions){
                        if(question.type._id.equals(newCounselor.type._id)){
                            const answer = {
                                question:question
                            };
                            evaluation.answers.create(answer);
                            evaluation.answers.push(answer);
                        }
                    }
                    newCounselor.evaluations.push(evaluation);
                    camp.counselors.push(newCounselor);
                }
                camp.save({ validateBeforeSave: false });
            })
            .then((camp)=>{
                res.json({success:true});
            });
        }
        else{
            Camp.update({"_id":req.decoded.campId},{$push:{counselors:{$each:req.body}}}, (err, camp)=>{
                if(err){
                    res.json({success:false,message:err});
                }
                else{
                    res.json({success:true});
                }
            });
        }
    });

    router.delete('/remove_counselor/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {

            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{counselors:{_id:req.params.id}}},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Counselor deleted!' }); 
                }
            });
        }
      });

      router.post('/rehire',(req,res)=>{
        Camp.findById(req.decoded.campId, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                var counselor = camp.counselors.id(req.body.counselor._id);
                counselor.sessions.push(req.body.session);
                /***/
                if(camp.options.evaluationOpts){
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
                }
                /***/
                if(counselor.division)
                    counselor.division.remove();
                if(counselor.specialty)
                    counselor.specialty.remove();
                
                camp.save({ validateBeforeSave: false });
                res.json({success: true})
            }
        });
      });

    /* DIVISION ROUTES */


    router.get('/all_divisions',(req,res) =>{

        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$divisions'},
            { $project: {divisions:1}},
            { $group : { _id : {gender:"$divisions.gender"}, divisions:{$push:"$divisions"}}},
            
        ],(err,result)=>{
            res.json({success:true,divisions:result});
        });
        // Camp.findOne({_id:req.decoded.campId},(err,camp) => {
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         if(!camp.divisions || camp.divisions.length == 0){
        //             res.json({success:false, message:'No divisions registered'})
        //         }
        //         else{
        //            res.json({success:true,divisions:camp.divisions});
        //         }
        //     }
        // });
    });

    router.post('/register_division',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{divisions:{$each:[{name:req.body.name,gender:'male'},{name:req.body.name,gender:'female'}]}}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.delete('/remove_division/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {

            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{divisions:{_id:req.params.id}}},(err)=>{
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
        Camp.update({_id:req.decoded.campId,counselors:{$elemMatch:{_id:req.body._id}}},{$set:{"counselors.$.division":req.body.toAdd}}, (err,counselor)=>{
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

        // let evalOpts = new EvalOpts();

        // Camp.update({"_id":req.body._id},{$push:{modules:req.body.toAdd},"options.evaluationOpts":evalOpts}, (err)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
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
            type: req.body.type
        });
        bcrypt.hash(user.password,null,null,(err,hash) => {
            user.password = hash;
            Camp.update({_id:req.decoded.campId},{$push:{users:user}},(err)=>{
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
                            else if(err.errors['users.0.email']){
                                res.json({
                                    success:false,
                                    message: err.errors['users.0.email'].message
                                });
                            }
                            else if(err.errors['users.0.password']){
                                res.json({
                                    success:false,
                                    message: err.errors['users.0.password'].message
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
        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$divisions'},
        //     { $project: {divisions:1}},
        //     { $unwind: '$divisions.leaders'},
        //     { $group : { _id : {_id:"$divisions.leaders._id",username:'$divisions.leaders.username',email:'$divisions.leaders.email'}, divisions:{$addToSet:"$divisions"}}}
        // ],(err,result)=>{
        //     res.json({success:true,heads:result});
        // });

        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.users.length == 1){
                    res.json({success:false, message:'No head staff registered'})
                }
                else{
                   res.json({success:true,heads:camp.users.slice(1)});
                }
            }
        });

    });
    //
    router.delete('/remove_head/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findByIdAndUpdate(req.decoded.campId,{$pull:{users:{_id:req.params.id}}},{new:true},(err,camp)=>{
            //Camp.findById(req.decoded.campId,(err,camp)=>{
                camp.divisions.forEach((division)=>{
                    division.leaders.forEach((leader)=>{
                        leader.remove();
                    });
                });
                camp.save({ validateBeforeSave: false });
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    
                    res.json({ success: true, message: 'Head staff member deleted!' }); 
                }
            });
        }
      });

      router.post('/add_head_division',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body._id}}},{$push:{"divisions.$.leaders":toAdd}},(err,camp)=>{
            res.json({success:true});
        });
        // Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body._id}}},{$push:{divisions:{leaders:req.body}}}, (err,head)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
    });

    router.post('/remove_head_division',(req,res) => {
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.body.division_id}}},{$pull:{"divisions.$.leaders":{_id:req.body.leader_id}}},(err,camp)=>{
            res.json({success:true});
        });
    });
    
    router.post('/add_head_specialty',(req,res) => {
        const toAdd = req.body.toAdd;
        delete req.body.toAdd;
        Camp.update({_id:req.decoded.campId,specialties:{$elemMatch:{_id:req.body._id}}},{$push:{"specialties.$.head_specialists":toAdd}},(err,camp)=>{
            console.log(camp);
            res.json({success:true});
        });
        // Camp.update({_id:req.decoded.campId,specialtys:{$elemMatch:{_id:req.body._id}}},{$push:{specialtys:{leaders:req.body}}}, (err,head)=>{
        //     if(err){
        //         res.json({success:false,message:err});
        //     }
        //     else{
        //         res.json({success:true});
        //     }
        // });
    });

    router.post('/remove_head_specialty',(req,res) => {
        Camp.update({_id:req.decoded.campId,specialties:{$elemMatch:{_id:req.body.specialty_id}}},{$pull:{"specialties.$.head_specialists":{_id:req.body.leader_id}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.post('/add_type_head',(req,res) => {
        Camp.update({_id:req.decoded.campId,users:{$elemMatch:{_id:req.body._id}}},{$set:{"users.$.type":req.body.toAddType}}, (err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    /* Specialties */

    router.post('/register_specialty',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{specialties:req.body}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.get('/all_specialties',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(camp.specialties.length == 0){
                    res.json({success:false, message:'No specialties registered'})
                }
                else{
                res.json({success:true,specialties:camp.specialties});
                }
            }
        });
    });

    router.delete('/remove_specialty/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
            Camp.findByIdAndUpdate(req.decoded.campId,{$pull:{specialties:{_id:req.params.id}}},{new:true}).exec().then((camp) =>{
                camp.counselors.forEach((counselor)=>{
                    if(counselor.specialty && counselor.specialty._id.equals(req.params.id))
                        counselor.specialty.remove()
                })
                camp.save({ validateBeforeSave: false });
                return;
            }).then(()=>{
                res.json({ success: true, message: 'Specialty deleted!' }); 
            });
        }
      });

      router.post('/add_specialty_counselor',(req,res) => {
        Camp.update({_id:req.decoded.campId,counselors:{$elemMatch:{_id:req.body._id}}},{$set:{"counselors.$.specialty":req.body.toAddSpecialty}}, (err,counselor)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
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
            const newSession = camp.sessions.create(req.body);
            camp.sessions.push(newSession);
            camp.options.session = newSession;
            if(camp.options.evaluationOpts){
                camp.options.evaluationOpts.currentEval = 1;
                camp.options.evaluationOpts.furthestReached = 1;
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
    
    return router;
}