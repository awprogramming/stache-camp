
// var cron = require('cron');
// const nodemailer = require('nodemailer');
// const Camp = require('./models/camp');
// var CronJob = cron.CronJob;

// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: account.user, // generated ethereal user
//             pass: account.pass // generated ethereal password
//         }
//     });

// // new CronJob('*/20 * * * * *', function() {
//    Camp.find({}, (err, camps)=>{
//             console.log("***CRON START***");
//             for(let camp of camps){
//                 for(let game of camp.games){
//                     //CHECK FOR RIGHT DATE
//                     console.log("**GAME***")
//                     for(let hs of game.specialty.head_specialists){
//                         sendRoster(hs.email,game,camp);
//                     }
//                     if(game.needsLunch)
//                         sendKitchen("awprogramming@gmail.com",game,camp); //ADD OPTION TO ADD KITCHEN EMAIL
//                     if(game.location != "home")
//                         sendHealthCenter("awprogramming@gmail.com",game,camp); //ADD OPTION TO ADD HEALTH CENTER EMAIL
                    
//                     if(game.rosterId){
//                         var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//                         var leaders = [];
//                         for(let camper of roster.campers){
//                             var c = camp.campers.id(camper);
//                             for(let leader of c.division.leaders){
//                                 if(leaders.indexOf(String(leader._id))==-1){
//                                     leaders.push(String(leader._id));
//                                     sendRoster(leader.email,game,camp);
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//             console.log("***CRON END***");
//         });

// // }, null, true, 'America/New_York');



// function sendHealthCenter(email,game,camp){
//     var text = game.name + "\n";
//     text += "Roster:"+ "\n";
//     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//     for(let c of roster.campers){
//         var camper = camp.campers.id(c);
//         text += camper.first + " " + camper.last;
//         if(camper.meds.epi)
//             text += " (epi)";
//         if(camper.meds.inhaler)
//             text += " (inhaler)";
//         if(camper.meds.other.length!=0){
//             text += " ("
//             for(var i = 0; i <camper.meds.other.length; i++){
//                 text +=camper.meds.other[i].name;
//                 if(i!=camper.meds.other.length-1)
//                     text += ", ";
//             }
//             text += ")";
//         }
//         text+="\n";
//     }

//     var html = "<style>table,tr,td,th{border:thin solid black;border-collapse:collapse;} td{padding:5px;}</style>";
//     html += "<h1>"+game.name+ "</h1>";
//     html += "<h2>Roster:</h2>";
//     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//     html += "<table>"
//     html += "<tr><th>Name</th><th>Epi</th><th>Inhaler</th><th>Other</th></tr>"
//     for(let c of roster.campers){
//         html += "<tr>";
//         var camper = camp.campers.id(c);
//         html += "<td>";
//         html += camper.first + " " + camper.last;
//         html += "</td>";
//         html += "<td>";
//         if(camper.meds.epi)
//             html += "✔";
//         html += "</td>";
//         html += "<td>";
//         if(camper.meds.inhaler)
//             html += "✔";
//         html += "</td>";
//         html += "<td>";
//         if(camper.meds.other.length!=0){
//             for(var i = 0; i <camper.meds.other.length; i++){
//                 html +=camper.meds.other[i].name;
//                 if(i!=camper.meds.other.length-1)
//                     html += ", ";
//             }
//         }
//         html += "</td>";
//         html += "</tr>";
//     }
//     html += "</table>"
//     let mailOptions = {
//         from: '"Game Rosters" <rosters@stachecamp.com>', // sender address
//         to: email, // list of receivers
//         subject: 'Upcoming Game Roster', // Subject line
//         text: text, // plain text body
//         html: html // html body
//     };
//     var message = "Health Center Email Sent";
//     sendEmail(mailOptions,message);
// }

// function sendKitchen(email,game,camp){
//     var text = game.name + "\n";
//     text += "Roster:"+ "\n";
//     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//     for(let c of roster.campers){
//         var camper = camp.campers.id(c);
//         text += camper.first + " " + camper.last;
//         if(camper.dietary.allergies.length!=0){
//             text += " ("
//             for(var i = 0; i <camper.dietary.allergies.length; i++){
//                 text +=camper.dietary.allergies[i].name;
//                 if(i!=camper.dietary.allergies.length-1)
//                     text += ", ";
//             }
//             text += ")";
//         }
//         if(camper.dietary.other.length!=0){
//             text += " ("
//             for(var i = 0; i <camper.dietary.other.length; i++){
//                 text +=camper.dietary.other[i].name;
//                 if(i!=camper.dietary.other.length-1)
//                     text += ", ";
//             }
//             text += ")";
//         }
//         text+="\n";
//     }

//     var html = "<style>table,tr,td,th{border:thin solid black;border-collapse:collapse;} td{padding:5px;}</style>";
//     html += "<h1>"+game.name+ "</h1>";
//     html += "<h2>Roster:</h2>";
//     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//     html += "<table>"
//     html += "<tr><th>Name</th><th>Allergies</th><th>Other</th></tr>"
//     for(let c of roster.campers){
//         html += "<tr>"
//         var camper = camp.campers.id(c);
//         html += "<td>"
//         html += camper.first + " " + camper.last;
//         html += "</td>"
//         html += "<td>"
//         if(camper.dietary.allergies.length!=0){
//             for(var i = 0; i <camper.dietary.allergies.length; i++){
//                 html +=camper.dietary.allergies[i].name;
//                 if(i!=camper.dietary.allergies.length-1)
//                     html += ", ";
//             }
//         }
//         html += "</td>"
//         html += "<td>"
//         if(camper.dietary.other.length!=0){
//             for(var i = 0; i <camper.dietary.other.length; i++){
//                 html +=camper.dietary.other[i].name;
//                 if(i!=camper.dietary.other.length-1)
//                     html += ", ";
//             }
//         }
//         html += "</td>"
//         html += "</tr>";
//     }
//     html += "</table>"
//     let mailOptions = {
//         from: '"Game Rosters" <rosters@stachecamp.com>', // sender address
//         to: email, // list of receivers
//         subject: 'Upcoming Game Roster', // Subject line
//         text: text, // plain text body
//         html: html // html body
//     };
//     var message = "Kitchen Email Sent";
//     sendEmail(mailOptions,message);
// }

// function sendRoster(email,game,camp){
//     var text = game.name + "\n";
//     text += "Roster:"+ "\n";
//     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//     for(let c of roster.campers){
//         var camper = camp.campers.id(c);
//         text += camper.first + " " + camper.last;
//         text+="\n";
//     }

//     var html = "<style>table,tr,td,th{border:thin solid black;border-collapse:collapse;} td{padding:5px;}</style>";
//     html += "<h1>"+game.name+ "</h1>";
//     html += "<h2>Roster:</h2>";
//     var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
//     html += "<table>"
//     for(let c of roster.campers){
//         html += "<tr>"
//         var camper = camp.campers.id(c);
//         html += "<td>"
//         html += camper.first + " " + camper.last;
//         html += "</td>"
//         html += "</tr>";
//     }
//     html += "</table>"
//     html += "<h2>Coaches:</h2>";
//     if(game.coachIds.length == 0){
//         html += "<span>No Refs Pre-Selected</span>"
//     }
//     html += "<table>"
//     for(let c of game.coachIds){
//         html += "<tr>"
//         var coach = camp.counselors.id(c);
//         html += "<td>"
//         html += coach.first + " " + coach.last;
//         html += "</td>"
//         html += "</tr>";
//     }
//     html += "</table>"
//     html += "<h2>Refs:</h2>";
    
//     if(game.refIds.length == 0){
//         html += "<span>No Refs Pre-Selected</span>"
//     }
//     else{
//         html += "<table>"               
//         for(let c of game.refIds){
//             html += "<tr>"
//             var ref = camp.counselors.id(c);
//             html += "<td>"
//             html += ref.first + " " + ref.last;
//             html += "</td>"
//             html += "</tr>";
//         }
//         html += "</table>"
//     }
//     let mailOptions = {
//         from: '"Game Rosters" <rosters@stachecamp.com>', // sender address
//         to: email, // list of receivers
//         subject: 'Upcoming Game Roster', // Subject line
//         text: text, // plain text body
//         html: html // html body
//     };
//     var message = "Leader/HS Email Sent";
//     sendEmail(mailOptions,message);
// }

// function sendEmail(mailOptions,message){
//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log(message);
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// }
// });