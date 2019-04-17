
var cron = require('cron');
const nodemailer = require('nodemailer');
const Camp = require('./models/camp');
const CampEvent = require('./models/event')
var CronJob = cron.CronJob;

// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'tylerhillsports@gmail.com',
           pass: 'THC!2018'
       },
    pool:true
   });
 new CronJob('0 20 16 * * *', function() {
    console.log("cron")
    var three_after = new Date();
    three_after.setDate( three_after.getDate()+3);
    three_after.setUTCHours(0);
    three_after.setUTCMinutes(0);
    three_after.setUTCSeconds(0);
    three_after.setUTCMilliseconds(0);
    var four_after = new Date();
    four_after.setDate( four_after.getDate()+4);
    four_after.setUTCHours(0);
    four_after.setUTCMinutes(0);
    four_after.setUTCSeconds(0);
    four_after.setUTCMilliseconds(0);
    CampEvent.aggregate([
        {
            $redact: {
            $cond: {
                if: {
                    $and:[
                        {$gte:["$date",three_after]},
                        {$lte:["$date",four_after]},
                        {$eq:["$type","game"]}
                    ]
                }, 
                then: "$$KEEP",
                else: "$$PRUNE"
                },
            },

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
        { $unwind:{path:"$specialty.head_specialist_ids",preserveNullAndEmptyArrays: true}},
        { $addFields: {
            "specialty.convertedId": { $toObjectId: "$specialty.head_specialist_ids" }
        }
        },
        { $lookup:{
            from: "users",
            localField: "specialty.convertedId",
            foreignField: "_id",
            as: "head_specialist"
            }
        },
        { $unwind:{path:"$head_specialist",preserveNullAndEmptyArrays: true}},
        {
            $group:{
                _id:{
                    _id:"$_id",
                    name:"$name",
                    date:"$date",
                    tbd:"$tbd",
                    emailSent:"$emailSent",
                    notes:"$notes",
                    location:"$location",
                    opponent:"$opponent",
                    type:"$type",
                    needsLunch:"$needsLunch",
                    roster_id:"$roster_id",
                    coach_ids:"$coach_ids",
                    ref_ids:"$ref_ids",
                    division_ids:"$division_ids"
                },
                head_specialists:{
                    $push:"$head_specialist"
                }
            }
        },
        {
            $project:{
                _id:"$_id._id",
                date:"$_id.date",
                name:"$_id.name",
                tbd:"$_id.tbd",
                emailSent:"$_id.emailSent",
                notes:"$_id.notes",
                location:"$_id.location",
                opponent:"$_id.opponent",
                type:"$_id.type",
                needsLunch:"$_id.needsLunch",
                division_ids:"$_id.division_ids",
                roster_id:"$_id.roster_id",
                coach_ids:"$_id.coach_ids",
                ref_ids:"$_id.ref_ids",
                head_specialists:"$head_specialists"
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
        { $unwind:{path:"$division.leader_ids",preserveNullAndEmptyArrays: true}},
        { $addFields: {
            "convertedId": { $toObjectId: "$division.leader_ids" }
        }
        },
        { $lookup:{
            from: "users",
            localField: "convertedId",
            foreignField: "_id",
            as: "leader"
            }
        },
        { $unwind:{path:"$leader",preserveNullAndEmptyArrays: true}},
        {
            $group:{
                _id:{
                    _id:"$_id",
                    name:"$name",
                    date:"$date",
                    tbd:"$tbd",
                    emailSent:"$emailSent",
                    notes:"$notes",
                    location:"$location",
                    opponent:"$opponent",
                    type:"$type",
                    needsLunch:"$needsLunch",
                    roster_id:"$roster_id",
                    coach_ids:"$coach_ids",
                    ref_ids:"$ref_ids",
                    head_specialists:"$head_specialists"
                },
                leaders:{
                    $push:"$leader"
                }
            }
        },
        // {
        //     $group:{
        //         _id:{
        //             _id:"$_id",
        //             name:"$name",
        //             date:"$date",
        //             tbd:"$tbd",
        //             emailSent:"$emailSent",
        //             notes:"$notes",
        //             location:"$location",
        //             opponent:"$opponent",
        //             type:"$type",
        //             needsLunch:"$needsLunch",
        //             roster_id:"$roster_id",
        //             coach_ids:"$coach_ids",
        //             ref_ids:"$ref_ids",
        //             head_specialists:"$head_specialists"
        //         },
        //         divisions:{
        //             $push:"$division"
        //         }
        //     }
        // },
        {
            $project:{
                _id:"$_id._id",
                date:"$_id.date",
                name:"$_id.name",
                tbd:"$_id.tbd",
                emailSent:"$_id.emailSent",
                notes:"$_id.notes",
                location:"$_id.location",
                opponent:"$_id.opponent",
                type:"$_id.type",
                needsLunch:"$_id.needsLunch",
                leaders:"$leaders",
                roster_id:"$_id.roster_id",
                coach_ids:"$_id.coach_ids",
                ref_ids:"$_id.ref_ids",
                head_specialists:"$_id.head_specialists"
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
                    emailSent:"$emailSent",
                    needsLunch:"$needsLunch",
                    notes:"$notes",
                    location: "$location",
                    opponent: "$opponent",
                    roster:{
                        _id:"$roster._id",
                        name:"$roster.name"
                    },
                    leaders:"$leaders",
                    coach_ids:"$coach_ids",
                    ref_ids:"$ref_ids",
                    head_specialists:"$head_specialists"
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
                    emailSent:"$_id.emailSent",
                    needsLunch:"$_id.needsLunch",
                    notes:"$_id.notes",
                    location:"$_id.location",
                    opponent:"$_id.opponent",
                    roster:"$_id.roster",
                    leaders:"$_id.leaders",
                    ref_ids:"$_id.ref_ids",
                    head_specialists:"$_id.head_specialists"
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
                    emailSent:"$_id.emailSent",
                    needsLunch:"$_id.needsLunch",
                    notes:"$_id.notes",
                    location: "$_id.location",
                    opponent: "$_id.opponent",
                    roster:"$_id.roster",
                    leaders:"$_id.leaders",
                    coaches:"$coaches",
                    head_specialists:"$_id.head_specialists"
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
                emailSent:"$_id.emailSent",
                needsLunch:"$_id.needsLunch",
                notes:"$_id.notes",
                location:"$_id.location",
                opponent:"$_id.opponent",
                roster:"$_id.roster",
                leaders:"$_id.leaders",
                coaches:"$_id.coaches",
                refs:"$refs",
                head_specialists:"$_id.head_specialists"
                
            }
        },
    ],async function(err,events){
        // console.log(err,events);
        for(let game of events){
            if(!game.emailSent){
                // for(let hs of game.head_specialists){
                //     // sendRoster("awprogramming@gmail.com",game);
                //     sendRoster(hs.email,game);
                // }
                // for(let leader of game.leaders){

                //     sendRoster(leader.email,game);
                // }
                // // console.log(game.needsLunch);
                // if(game.needsLunch){
                //     // sendKitchen(["pete61731880@yahoo.com","food@tylerhillcamp.com"],game); //ADD OPTION TO ADD KITCHEN EMAIL
                //     sendKitchen(["food@tylerhillcamp.com"],game); //ADD OPTION TO ADD KITCHEN EMAIL
                //     // sendKitchen(["awprogramming@gmail.com"],game);
                //     //sendKitchen(["cadetboys@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD KITCHEN EMAIL
                // }
                // if(game.location != "home"){
                //     console.log("AWAY GAME");
                //     // sendHealthCenter(["awprogramming@gmail.com"],game);
                //     sendHealthCenter(["health@tylerhillcamp.com"],game); //ADD OPTION TO ADD HEALTH CENTER EMAIL
                //     //sendHealthCenter(["cadetboys@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD HEALTH CENTER EMAIL
                // }
                
                // if(game.rosterId){
                //     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
                //     var leaders = [];
                //     for(let camper of roster.campers){
                //         var c = camp.campers.id(camper);
                //         for(let leader of c.division.leaders){
                //             if(leaders.indexOf(String(leader._id))==-1){
                //                 leaders.push(String(leader._id));
                //                 console.log(displayDateTime(game.date.setUTCHours(14)));
                //                 //sendRoster("cadetboys@tylerhillcamp.com",game,camp);
                //                 sendRoster(["cadetboys@tylerhillcamp.com",leader.email],game,camp);
                //             }
                //         }
                //     }
                // }
                await CampEvent.update({_id:game._id},{emailSent:true},(err,result)=>{
                    console.log(err,result);
                });
                }
            }
    });
//    Camp.find({}, (err, camps)=>{
//             console.log("***CRON START***");
//             for(let camp of camps){
//                 for(let game of camp.games){
//                     var three_before = new Date(game.date);
//                     three_before.setDate(three_before.getDate()-1);
//                     if(!game.emailSent){
//                         if(new Date().getDate() == three_before.getDate() && new Date().getFullYear() == three_before.getFullYear()&& new Date().getMonth() == three_before.getMonth()){
//                             //CHECK FOR RIGHT DATE
//                             game.emailSent = true;
//                             camp.save({ validateBeforeSave: false });
//                             console.log("**GAME***")
//                             for(let hs of game.specialty.head_specialists){
//                                 sendRoster(hs.email,game,camp);
//                                 //sendRoster("cadetboys@tylerhillcamp.com",game,camp);
//                             }
//                             console.log(game.needsLunch);
//                             if(game.needsLunch){
//                                 sendKitchen(["cadetboys@tylerhillcamp.com","pete61731880@yahoo.com","food@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD KITCHEN EMAIL
//                                 console.log("FOOD");
//                                 //sendKitchen(["cadetboys@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD KITCHEN EMAIL
//                             }
//                             if(game.location != "home"){
//                                 console.log("AWAY GAME");
//                                 sendHealthCenter(["cadetboys@tylerhillcamp.com","health@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD HEALTH CENTER EMAIL
//                                 //sendHealthCenter(["cadetboys@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD HEALTH CENTER EMAIL
//                             }
                            
//                             if(game.rosterId){
//                                 var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//                                 var leaders = [];
//                                 for(let camper of roster.campers){
//                                     var c = camp.campers.id(camper);
//                                     for(let leader of c.division.leaders){
//                                         if(leaders.indexOf(String(leader._id))==-1){
//                                             leaders.push(String(leader._id));
//                                             console.log(displayDateTime(game.date.setUTCHours(14)));
//                                             //sendRoster("cadetboys@tylerhillcamp.com",game,camp);
//                                             sendRoster(["cadetboys@tylerhillcamp.com",leader.email],game,camp);
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//             console.log("***CRON END***");
//         });

  }, null, true, 'America/New_York');



function sendHealthCenter(email,game){
    var text = game.name + "\n";
    text += "Roster:"+ "\n";
    // var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(game.roster){
        for(let c of game.roster.campers){
            text += c.first + " " + c.last;
            if(c.meds){
                if(c.meds.epi)
                    text += " (epi)";
                if(c.meds.inhaler)
                    text += " (inhaler)";
                if(c.meds.other.length!=0){
                    text += " ("
                    for(var i = 0; i <c.meds.other.length; i++){
                        text +=c.meds.other[i].name;
                        if(i!=c.meds.other.length-1)
                            text += ", ";
                    }
                    text += ")";
                }
            }
            text+="\n";
        }
    }
    else{
        text+="No roster submitted";
    }

    var html = "<h1>"+game.name+ "</h1>";
    html += "<h2>"+displayDateTime(game.date)+"</h2>";
    html += "<h2>Roster:</h2>";
    if(game.roster){
        html += "<table style='border:thin solid black;border-collapse:collapse;'>"
        html += "<tr style='border:thin solid black;border-collapse:collapse;'><th style='border:thin solid black;border-collapse:collapse;'>Name</th><th style='border:thin solid black;border-collapse:collapse;'>Epi</th><th style='border:thin solid black;border-collapse:collapse;'>Inhaler</th><th style='border:thin solid black;border-collapse:collapse;'>Other</th></tr>"
        for(let c of game.roster.campers){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            html += c.first + " " + c.last;
            html += "</td>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            if(c.meds.epi)
                html += "✔";
            html += "</td>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            if(c.meds.inhaler)
                html += "✔";
            html += "</td>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            if(c.meds.other.length!=0){
                for(var i = 0; i <c.meds.other.length; i++){
                    html +=c.meds.other[i].name;
                    if(i!=c.meds.other.length-1)
                        html += ", ";
                }
            }
            html += "</td>";
            html += "</tr>";
        }
        html += "</table>"
    }
    else{
        html+="<p>No roster Submitted</p>";
    }
    
    if(game.coaches.length == 0){
        html += "<span>No Refs Pre-Selected</span>"
    }
    html += "<table style='border:thin solid black;border-collapse:collapse;'>"
    for(let c of game.coaches){
        html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
        html += "<td style='border:thin solid black;border-collapse:collapse;'>"
        html += c.first + " " + c.last;
        html += "</td>"
        html += "</tr>";
    }
    html += "</table>"
    html += "<h2>Refs:</h2>";
    
    if(game.refs.length == 0){
        html += "<span>No Refs Pre-Selected</span>"
    }
    else{
        html += "<table style='border:thin solid black;border-collapse:collapse;'>"               
        for(let c of game.refs){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
            html += "<td style='border:thin solid black;border-collapse:collapse;'>"
            html += c.first + " " + c.last;
            html += "</td>"
            html += "</tr>";
        }
        html += "</table>"
    }
    let mailOptions = {
        from: '"Game Rosters" <rosters@stachecamp.com>', // sender address
        to: email, // list of receivers
        subject: 'Upcoming Game Roster', // Subject line
        text: text, // plain text body
        html: html // html body
    };
    var message = "Health Center Email Sent";
    sendEmail(mailOptions,message);
}

function sendKitchen(email,game){
    console.log("*****");
    var text = game.name + "\n";
    text += "Roster:"+ "\n";
    if(game.roster){
        for(let c of game.roster.campers){
            text += c.first + " " + c.last;
            if(c.dietary.allergies.length!=0){
                text += " ("
                for(var i = 0; i <c.dietary.allergies.length; i++){
                    text +=c.dietary.allergies[i].name;
                    if(i!=c.dietary.allergies.length-1)
                        text += ", ";
                }
                text += ")";
            }
            if(c.dietary.other.length!=0){
                text += " ("
                for(var i = 0; i <c.dietary.other.length; i++){
                    text +=c.dietary.other[i].name;
                    if(i!=c.dietary.other.length-1)
                        text += ", ";
                }
                text += ")";
            }
            text+="\n";
        }
    }
    else{
        text+="No roster submitted";
    }

    var html = "<style>table,tr,td,th{border:thin solid black;border-collapse:collapse;} td{padding:5px;}</style>";
    html += "<h1>"+game.name+ "</h1>";
    html += "<h2>"+displayDateTime(game.date)+"</h2>";
    html += "<h2>Roster:</h2>";
    if(game.roster){
        html += "<table>"
        html += "<tr style='border:thin solid black;border-collapse:collapse;'><th style='border:thin solid black;border-collapse:collapse;'>Name</th><th style='border:thin solid black;border-collapse:collapse;'>Allergies</th><th style='border:thin solid black;border-collapse:collapse;'>Other</th></tr>"
        for(let c of game.roster.campers){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
            html += "<td style='border:thin solid black;border-collapse:collapse;'>"
            html += c.first + " " + c.last;
            html += "</td>"
            html += "<td style='border:thin solid black;border-collapse:collapse;'>"
            if(c.dietary.allergies.length!=0){
                for(var i = 0; i <c.dietary.allergies.length; i++){
                    html +=c.dietary.allergies[i].name;
                    if(i!=c.dietary.allergies.length-1)
                        html += ", ";
                }
            }
            html += "</td>"
            html += "<td style='border:thin solid black;border-collapse:collapse;'>"
            if(c.dietary.other.length!=0){
                for(var i = 0; i <c.dietary.other.length; i++){
                    html +=c.dietary.other[i].name;
                    if(i!=c.dietary.other.length-1)
                        html += ", ";
                }
            }
            html += "</td>"
            html += "</tr>";
        }
        html += "</table>"
    }
    else{
        html+="<p>No roster Submitted</p>";
    }
    let mailOptions = {
        from: '"Game Rosters" <rosters@stachecamp.com>', // sender address
        to: email, // list of receivers
        subject: 'Upcoming Game Roster', // Subject line
        text: text, // plain text body
        html: html // html body
    };
    var message = "Kitchen Email Sent";
    sendEmail(mailOptions,message);
}

function sendRoster(email,game){
    var text = game.name + "\n";
    text += "Roster:"+ "\n";
    // var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(game.roster){
        for(let c of game.roster.campers){
            text += c.first + " " + c.last;
            text+="\n";
        }
    }
    else{
        text+="No roster submitted";
    }

    var html = "<style>table,tr,td,th{border:thin solid black;border-collapse:collapse;} td{padding:5px;}</style>";
    html += "<h1>"+game.name+ "</h1>";
    html += "<h2>"+displayDateTime(game.date)+"</h2>";
    html += "<h2>Location: "+game.location+"</h2>";
    html += "<h2>Roster:</h2>";

    // var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(game.roster){
        html += "<table>";
        for(let c of game.roster.campers){
                html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
                // var camper = camp.campers.id(c);
                html += "<td style='border:thin solid black;border-collapse:collapse;'>"
                html += c.first + " " + c.last;
                html += "</td>"
                html += "</tr>";
            }
        
        html += "</table>"
        html += "<h2>Coaches:</h2>";
    }
    else{
        html+="<p>No roster Submitted</p>";
    }
    if(game.coaches.length == 0){
        html += "<span>No Refs Pre-Selected</span>"
    }
    html += "<table>"
    for(let c of game.coaches){
        html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
        html += "<td style='border:thin solid black;border-collapse:collapse;'>"
        html += c.first + " " + c.last;
        html += "</td>"
        html += "</tr>";
    }
    html += "</table>"
    html += "<h2>Refs:</h2>";
    
    if(game.refs.length == 0){
        html += "<span>No Refs Pre-Selected</span>"
    }
    else{
        html += "<table>"               
        for(let c of game.refs){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
            html += "<td style='border:thin solid black;border-collapse:collapse;'>"
            html += c.first + " " + c.last;
            html += "</td>"
            html += "</tr>";
        }
        html += "</table>"
    }
    let mailOptions = {
        from: '"Game Rosters" <rosters@stachecamp.com>', // sender address
        to: email, // list of receivers
        subject: 'Upcoming Game Roster', // Subject line
        text: text, // plain text body
        html: html // html body
    };
    var message = "Leader/HS Email Sent";
    sendEmail(mailOptions,message);
}

function sendEmail(mailOptions,message){
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(message);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

function displayDateTime(date){
    var d = new Date(date);
    // d.setHours(d.getHours() - 4);
    var time = d.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit',hour12:true,timezone:"America/New_York"});
    var day = getDayName(d.getDay());
    var month = getMonthName(d.getMonth());
    return time + " on " + day+ ", " + month + " " + d.getDate();
}

function getMonthName(month){
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return monthNames[month];
  }

function getDayName(day){
    var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return dayNames[day];
  }
// });
