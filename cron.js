
var cron = require('cron');
const nodemailer = require('nodemailer');
const Camp = require('./models/camp');
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

 new CronJob('0 0 14 * * *', function() {
   Camp.find({}, (err, camps)=>{
            console.log("***CRON START***");
            for(let camp of camps){
                for(let game of camp.games){
                    var three_before = new Date(game.date);
                    three_before.setDate(three_before.getDate()-1);
                    if(!game.emailSent){
                        if(new Date().getDate() == three_before.getDate() && new Date().getFullYear() == three_before.getFullYear()&& new Date().getMonth() == three_before.getMonth()){
                            //CHECK FOR RIGHT DATE
                            game.emailSent = true;
                            camp.save({ validateBeforeSave: false });
                            console.log("**GAME***")
                            for(let hs of game.specialty.head_specialists){
                                sendRoster(hs.email,game,camp);
                                //sendRoster("cadetboys@tylerhillcamp.com",game,camp);
                            }
                            console.log(game.needsLunch);
                            if(game.needsLunch){
                                sendKitchen(["cadetboys@tylerhillcamp.com","pete61731880@yahoo.com","food@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD KITCHEN EMAIL
                                console.log("FOOD");
                                //sendKitchen(["cadetboys@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD KITCHEN EMAIL
                            }
                            if(game.location != "home"){
                                console.log("AWAY GAME");
                                sendHealthCenter(["cadetboys@tylerhillcamp.com","health@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD HEALTH CENTER EMAIL
                                //sendHealthCenter(["cadetboys@tylerhillcamp.com"],game,camp); //ADD OPTION TO ADD HEALTH CENTER EMAIL
                            }
                            
                            if(game.rosterId){
                                var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
                                var leaders = [];
                                for(let camper of roster.campers){
                                    var c = camp.campers.id(camper);
                                    for(let leader of c.division.leaders){
                                        if(leaders.indexOf(String(leader._id))==-1){
                                            leaders.push(String(leader._id));
                                            //sendRoster("cadetboys@tylerhillcamp.com",game,camp);
                                            sendRoster(["cadetboys@tylerhillcamp.com",leader.email],game,camp);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log("***CRON END***");
        });

  }, null, true, 'America/New_York');



function sendHealthCenter(email,game,camp){
    var text = game.name + "\n";
    text += "Roster:"+ "\n";
    var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(roster){
        for(let c of roster.campers){
            var camper = camp.campers.id(c);
            text += camper.first + " " + camper.last;
            if(camper.meds){
                if(camper.meds.epi)
                    text += " (epi)";
                if(camper.meds.inhaler)
                    text += " (inhaler)";
                if(camper.meds.other.length!=0){
                    text += " ("
                    for(var i = 0; i <camper.meds.other.length; i++){
                        text +=camper.meds.other[i].name;
                        if(i!=camper.meds.other.length-1)
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
    var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(roster){
        html += "<table style='border:thin solid black;border-collapse:collapse;'>"
        html += "<tr style='border:thin solid black;border-collapse:collapse;'><th style='border:thin solid black;border-collapse:collapse;'>Name</th><th style='border:thin solid black;border-collapse:collapse;'>Epi</th><th style='border:thin solid black;border-collapse:collapse;'>Inhaler</th><th style='border:thin solid black;border-collapse:collapse;'>Other</th></tr>"
        for(let c of roster.campers){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>";
            var camper = camp.campers.id(c);
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            html += camper.first + " " + camper.last;
            html += "</td>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            if(camper.meds.epi)
                html += "✔";
            html += "</td>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            if(camper.meds.inhaler)
                html += "✔";
            html += "</td>";
            html += "<td style='border:thin solid black;border-collapse:collapse;'>";
            if(camper.meds.other.length!=0){
                for(var i = 0; i <camper.meds.other.length; i++){
                    html +=camper.meds.other[i].name;
                    if(i!=camper.meds.other.length-1)
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

function sendKitchen(email,game,camp){
    var text = game.name + "\n";
    text += "Roster:"+ "\n";
    var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(roster){
        for(let c of roster.campers){
            var camper = camp.campers.id(c);
            text += camper.first + " " + camper.last;
            if(camper.dietary.allergies.length!=0){
                text += " ("
                for(var i = 0; i <camper.dietary.allergies.length; i++){
                    text +=camper.dietary.allergies[i].name;
                    if(i!=camper.dietary.allergies.length-1)
                        text += ", ";
                }
                text += ")";
            }
            if(camper.dietary.other.length!=0){
                text += " ("
                for(var i = 0; i <camper.dietary.other.length; i++){
                    text +=camper.dietary.other[i].name;
                    if(i!=camper.dietary.other.length-1)
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
    var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(roster){
        html += "<table>"
        html += "<tr style='border:thin solid black;border-collapse:collapse;'><th style='border:thin solid black;border-collapse:collapse;'>Name</th><th style='border:thin solid black;border-collapse:collapse;'>Allergies</th><th style='border:thin solid black;border-collapse:collapse;'>Other</th></tr>"
        for(let c of roster.campers){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
            var camper = camp.campers.id(c);
            html += "<td>"
            html += camper.first + " " + camper.last;
            html += "</td>"
            html += "<td>"
            if(camper.dietary.allergies.length!=0){
                for(var i = 0; i <camper.dietary.allergies.length; i++){
                    html +=camper.dietary.allergies[i].name;
                    if(i!=camper.dietary.allergies.length-1)
                        html += ", ";
                }
            }
            html += "</td>"
            html += "<td>"
            if(camper.dietary.other.length!=0){
                for(var i = 0; i <camper.dietary.other.length; i++){
                    html +=camper.dietary.other[i].name;
                    if(i!=camper.dietary.other.length-1)
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

function sendRoster(email,game,camp){
    var text = game.name + "\n";
    text += "Roster:"+ "\n";
    var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(roster){
        for(let c of roster.campers){
            var camper = camp.campers.id(c);
            text += camper.first + " " + camper.last;
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

    var roster = camp.specialties.id(game.specialty._id).rosters.id(game.rosterId);
    if(roster){
        html += "<table>";
        for(let c of roster.campers){
                html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
                var camper = camp.campers.id(c);
                html += "<td>"
                html += camper.first + " " + camper.last;
                html += "</td>"
                html += "</tr>";
            }
        
        html += "</table>"
        html += "<h2>Coaches:</h2>";
    }
    else{
        html+="<p>No roster Submitted</p>";
    }
    if(game.coachIds.length == 0){
        html += "<span>No Refs Pre-Selected</span>"
    }
    html += "<table>"
    for(let c of game.coachIds){
        html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
        var coach = camp.counselors.id(c);
        html += "<td>"
        html += coach.first + " " + coach.last;
        html += "</td>"
        html += "</tr>";
    }
    html += "</table>"
    html += "<h2>Refs:</h2>";
    
    if(game.refIds.length == 0){
        html += "<span>No Refs Pre-Selected</span>"
    }
    else{
        html += "<table>"               
        for(let c of game.refIds){
            html += "<tr style='border:thin solid black;border-collapse:collapse;'>"
            var ref = camp.counselors.id(c);
            html += "<td>"
            html += ref.first + " " + ref.last;
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
    var d = new Date(date)
    var time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit',hour12:true});
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
