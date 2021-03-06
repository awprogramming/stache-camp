const env = require('./env');
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const camps = require('./routes/camps')(router);
const modules = require('./routes/modules')(router);
const evaluations = require('./routes/evaluations')(router);
const sports = require('./routes/sports')(router);
const meds = require('./routes/meds')(router);
const swim = require('./routes/swim')(router);
const events = require('./routes/events')(router);
const dbMaintenance = require('./routes/dbMaintenance')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080; // Allows heroku to set port

require('./cron');


mongoose.connect(config.uri, (err) => {
    if(err){
        console.log("Could NOT connect to database");
    } else {
        console.log("Connected to database: "+config.uri);
    }
});

app.use(cors({
    origin:'http://localhost:4200'
}));

app.use(bodyParser.urlencoded({ exteded: false}));
app.use(bodyParser.json());
//app.use(express.static(__dirname + '/public'));

app.use('/authentication',authentication);
app.use('/modules',modules);
app.use('/camps',camps);
app.use('/evaluations',evaluations);
app.use('/sports',sports);
app.use('/meds',meds);
app.use('/swim',swim);
app.use('/events',events);
app.use('/dbMaintenance',dbMaintenance)

// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/src/index.html'));
});


app.listen(port, () =>{
    console.log('Listening on port ' + process.env.PORT);
});