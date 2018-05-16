const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const camps = require('./routes/camps')(router);
const modules = require('./routes/modules')(router);
const evaluations = require('./routes/evaluations')(router);
const sports = require('./routes/sports')(router);
const meds = require('./routes/meds')(router);
const swim = require('./routes/swim')(router);
const bodyParser = require('body-parser');
const cors = require('cors');


require('./cron');


mongoose.Promise = global.Promise;
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
app.use(express.static(__dirname + '/public'));
app.use('/modules',modules);
app.use('/camps',camps);
app.use('/authentication',authentication);
app.use('/evaluations',evaluations);
app.use('/sports',sports);
app.use('/meds',meds);
app.use('/swim',swim);


app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname +'/public/index.html'));
});

// serve angular front end files from root path
router.use('/', express.static('app', { redirect: false }));
 
// rewrite virtual urls to angular app to enable refreshing of internal pages
router.get('*', function (req, res, next) {
    res.sendFile(path.resolve('app/index.html'));
});

app.listen(process.env.PORT || 8080, () =>{
    console.log('Listening on port ' + process.env.PORT);
});