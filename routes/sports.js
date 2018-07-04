const Camp = require('../models/camp');
const User = require('../models/user');
const config = require('../config/database');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

module.exports = (router) => {
   
    router.post('/add_roster/',(req,res) => {
        Camp.findById(req.decoded.campId, (err, camp)=>{
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
                var specialty = camp.specialties.id(req.body.specialty._id);
                const roster = {
                    name:req.body.name,
                    campers:[],
                    session:camp.options.session
                };
                specialty.rosters.create(roster);
                specialty.rosters.push(roster);
                camp.save({ validateBeforeSave: false });
                res.send({success:true});
            }
        });

    });

    router.get('/all_rosters',(req,res) =>{
        Camp.findById(req.decoded.campId, (err, camp)=>{
            var specialties = [];
            if(camp.users.id(req.decoded.userId).type.type == "admin"){
                console.log("Hello world");
                specialties = camp.specialties;
            }
            else{
                for(let specialty of camp.specialties){
                    for(let hs of specialty.head_specialists){
                        if(req.decoded.userId==hs._id)
                            specialties.push(specialty)
                            break;
                    }
                }
            }
            console.log(specialties);
            res.send({success:true, specialties:specialties});
        });
    });

    router.get('/specialty_rosters/:specialtyId',(req,res) =>{
        Camp.findById(req.decoded.campId, (err, camp)=>{

            var spec_rosters = camp.specialties.id(req.params.specialtyId).rosters;
            rosters = [];
            for(let roster of spec_rosters){
                if(roster.session._id.equals(camp.options.session._id))
                    rosters.push(roster);
            }
            res.send({success:true, rosters:rosters});
        });
    });

    router.delete('/remove_roster/:specialty/:roster', (req, res) => {
        Camp.update({_id:req.decoded.campId,specialties:{$elemMatch:{_id:req.params.specialty}}},{$pull:{"specialties.$.rosters":{_id:req.params.roster}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.delete('/remove_internal_roster/:division/:roster', (req, res) => {
        Camp.update({_id:req.decoded.campId,divisions:{$elemMatch:{_id:req.params.division}}},{$pull:{"divisions.$.rosters":{_id:req.params.roster}}},(err,camp)=>{
            res.json({success:true});
        });
    });

    router.get('/get_roster/:specialtyId/:rosterId/',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                roster = camp.specialties.id(req.params.specialtyId).rosters.id(req.params.rosterId);
                for(var i = 0; i < roster.campers.length; i++){
                    roster.campers[i] = camp.campers.id(roster.campers[i]);
                }
                res.json({success:true, roster:roster});
            }
        });
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
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var roster = camp.specialties.id(req.body.sd_id).rosters.id(req.body.r_id);
            roster.campers.push(req.body.c_id);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
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
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var roster = camp.specialties.id(req.body.sd_id).rosters.id(req.body.r_id);
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

    router.get('/get_leader_rosters',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            const cur_sess = camp.options.session._id;
            const leader_id = req.decoded.userId;
            var rosters = {};
            for(let specialty of camp.specialties){
                for(let roster of specialty.rosters){
                    var pushed = false;
                    for(let camper of roster.campers){
                        camper = camp.campers.id(camper);
                        var division = camp.divisions.id(camper.division._id);
                        for(let leader of division.leaders){
                            if(leader._id == leader_id){
                                if(rosters[camper.division.name]){
                                    if(rosters[camper.division.name]["specialties"][specialty.name]){
                                        rosters[camper.division.name]["specialties"][specialty.name].push({ roster:roster,s_id:specialty._id});
                                    }
                                    else{
                                        rosters[camper.division.name]["specialties"][specialty.name] = [{ roster:roster,s_id:specialty._id}];
                                    }
                                }
                                else{
                                    rosters[camper.division.name] = {d_id:camper.division._id,specialties:{}};
                                    rosters[camper.division.name]["specialties"][specialty.name] = [{ roster:roster,s_id:specialty._id}];
                                }
                                pushed = true;
                                break;
                            }
                            if(pushed)
                                break; 
                        }
                        if(pushed)
                            break;
                    }
                }
            }
            for(let division of Object.keys(rosters)){
                rosters[division]["internal"] = camp.divisions.id(rosters[division].d_id).rosters;
            }
            res.send({success:true,rosters:rosters});
        });

        // Camp.aggregate([
        //     { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
        //     { $unwind: '$specialties'},
        //     { $project: {specialties:1}},
        //     { $unwind: '$specialties.rosters'},
        //     { $unwind: '$specialties.rosters.campers'},
        //     { $group : {
        //         _id : {s_id:"$specialties._id",s_name:"$specialties.name",sess_id:"$specialties.rosters.session._id",roster:"$specialties.rosters._id"}, 
        //         divisions:{$push:"$specialties.rosters.campers.division"}
        //         }
        //     },
        // ]).exec().then((result)=>{
        //         var rosters = {};
        //         for(let roster of result){ 
        //             for(let division of roster.divisions){
        //                 for(let leader of division.leaders){
        //                     if(leader._id == req.decoded.userId){
        //                         if(rosters[division.name]){
        //                             if(rosters[division.name]["specialties"][roster._id.s_name])
        //                             rosters[division.name]["specialties"][roster._id.s_name].push({ _id:roster._id.roster,s_id:roster._id.s_id});
        //                             else
        //                                 rosters[division.name]["specialties"][roster._id.s_name] = { _id:roster._id.roster,s_id:roster._id.s_id};
        //                         }
        //                         else{
        //                             rosters[division.name] = {d_id:division._id,specialties:{}};
        //                             rosters[division.name]["specialties"][roster._id.s_name] = [{ _id:roster._id.roster,s_id:roster._id.s_id}];
        //                         }
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        //     return rosters;
        // })
        // .then((rosters)=>{
        //     Camp.findById(req.decoded.campId,(err,camp)=>{
        //         if(err){
        //             res.json({success:false,message:err});
        //         }
        //         else{
        //             for(let division of Object.keys(rosters)){
        //                 for(let specialty of Object.keys(rosters[division])){
        //                     for(var i = 0; i < rosters[division]["specialties"][specialty].length; i++){
        //                         var s_id = rosters[division]["specialties"][specialty][i].s_id;
        //                         rosters[division]["specialties"][specialty][i] = {
        //                             roster:camp.specialties.id(rosters[division]["specialties"][specialty][i].s_id).rosters.id(rosters[division]["specialties"][specialty][i]._id),
        //                             s_id:rosters[division]["specialties"][specialty][i].s_id
        //                         };
        //                     }
        //                 }
        //             }
        //         }
        //         res.send({success:true,rosters:rosters});
        //     });
        // });
    });

    router.post('/schedule_game',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.create(req.body);
            
            camp.games.push(game);
            camp.save({ validateBeforeSave: false });
            if(game.divisionId)
                game.division = camp.divisions.id(game.divisionId)
            //gameScheduledEmail(game);
            res.send({success:true,game:game});
        });
    });

    router.post('/remove_game',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.pull(req.body.gameId);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.get('/get_month_games/:month/:year/:type',(req,res) => {
        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$games'},
            { $project: {games:1}},
            { $sort: {'games.date':1}},
        ]).exec().then((gamesList)=>{
            var games = [];
            Camp.findById(req.decoded.campId,(err,camp)=>{
                for(let game of gamesList){
                    if(game.games.date.getMonth() == req.params.month && game.games.date.getFullYear() == req.params.year){
                        if(req.params.type == "admin"){
                            if(game.games.divisionId)
                                game.games.division = camp.divisions.id(game.games.divisionId);
                            games.push(game.games);  
                        }
                        else if(req.params.type == "head_specialist"){
                            for(let hs of game.games.specialty.head_specialists){
                                if(hs._id == req.decoded.userId){
                                    if(game.games.divisionId)
                                        game.games.division = camp.divisions.id(game.games.divisionId);
                                    games.push(game.games);
                                    break;
                                }
                            }   
                        } 
                        else if(req.params.type == "leader"){
                            if(game.games.divisionId){
                                game.games.division = camp.divisions.id(game.games.divisionId);
                                var pushed = false;
                                console.log(game.games.division.leaders);
                                for(let leader of game.games.division.leaders){
                                    console.log("TEST");
                                    console.log(leader._id,req.decoded.userId);
                                    if(leader._id == req.decoded.userId){
                                        games.push(game.games);
                                        pushed = true;
                                        break;
                                    }
                                }
                                if(!pushed){
                                    for(let approver of game.games.division.approvers){
                                        if(approver._id == req.decoded.userId){
                                            games.push(game.games);
                                            pushed = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            else if(game.games.rosterId){
                                var roster = camp.specialties.id(game.games.specialty._id).rosters.id(game.games.rosterId);
                                for(let camper of roster.campers){
                                    var pushed = false;
                                    division = camp.divisions.id(camp.campers.id(camper).division._id);
                                    for(let leader of division.leaders){
                                        if(leader._id == req.decoded.userId){
                                            if(game.games.divisionId)
                                                game.games.division = camp.divisions.id(game.games.divisionId);
                                            games.push(game.games);
                                        
                                            pushed = true;
                                            break;
                                        } /* could be error location */
                                    }
                                    if(pushed)
                                        break;
                                }
                            }
                        }  
                    }
                }
                res.send({success:true,games:games});
            })
        })
    });

    router.get('/get_division_month_games/:month/:year/:divisionId',(req,res) => {
        Camp.aggregate([
            { $match: {_id:mongoose.Types.ObjectId(req.decoded.campId)}},
            { $unwind: '$games'},
            { $project: {games:1}},
            { $sort: {'games.date':1}},
        ]).exec().then((gamesList)=>{
            var games = [];
            Camp.findById(req.decoded.campId,(err,camp)=>{
                for(let game of gamesList){
                    if(game.games.date.getMonth() == req.params.month && game.games.date.getFullYear() == req.params.year){
                        if(game.games.divisionId && game.games.divisionId == req.params.divisionId){
                            game.games.division = camp.divisions.id(game.games.divisionId);
                            games.push(game.games);
                        }
                        else if(game.games.rosterId){
                            var roster = camp.specialties.id(game.games.specialty._id).rosters.id(game.games.rosterId);
                            for(let camper of roster.campers){
                                var pushed = false;
                                
                                if(camp.campers.id(camper) && camp.campers.id(camper).division && camp.campers.id(camper).division._id == req.params.divisionId){
                                    if(game.games.divisionId)
                                         game.games.division = camp.divisions.id(game.games.divisionId);
                                    games.push(game.games);
                                    pushed = true;
                                    break;
                                }
                                if(pushed)
                                    break;
                            }
                        } 
                    }
                }
                res.send({success:true,games:games});
            })
        })
    });

    router.get('/get_game/:id',(req,res) => {
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.params.id);
            var campers = [];
            var coaches = [];
            var refs = [];
            var division = camp.divisions.id(game.divisionId);
            if(game.rosterId){
                game.roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
                
                for(let camper of game.roster.campers){
                    campers.push(camp.campers.id(camper));
                }
                game.roster.campers = campers;
            }
            if(game.coachIds){
                for(let counselor of game.coachIds){
                    coaches.push(camp.counselors.id(counselor));
                }
            }
            if(game.refIds){
                for(let counselor of game.refIds){
                    refs.push(camp.counselors.id(counselor));
                }
            }
            res.send({success:true,game:game,coaches:coaches,refs:refs,campers:campers,division:division});
        });
    });

    router.post('/change_game_division',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.divisionId = req.body.divisionId;
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/add_roster_to_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.rosterId = req.body.roster;
            camp.save({ validateBeforeSave: false });
            game.roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
            game.roster.camperObjs = []
            game.division = camp.divisions.id(game.divisionId);
            for(let camperId of game.roster.campers){
                var camper = camp.campers.id(camperId);
                camper.division = camp.divisions.id(camper.division._id);
                game.roster.camperObjs.push(camper);
            }
            rosterSubmittedEmail(game);
            res.send({success:true});
        });
    });
    router.post('/remove_roster_from_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.rosterId = undefined;
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/add_coach_to_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.coachIds.push(req.body.coachId);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/remove_coach_from_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            for(var i = 0; i < game.coachIds.length; i++){
                if(game.coachIds[i] == req.body.coachId){
                    game.coachIds.splice(i,1);
                    break;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/add_ref_to_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            game.refIds.push(req.body.refId);
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
    });

    router.post('/remove_ref_from_game',(req,res)=>{
        Camp.findById(req.decoded.campId,(err,camp)=>{
            var game = camp.games.id(req.body.gameId);
            for(var i = 0; i < game.refIds.length; i++){
                if(game.refIds[i] == req.body.refId){
                    game.refIds.splice(i,1);
                    break;
                }
            }
            camp.save({ validateBeforeSave: false });
            res.send({success:true});
        });
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