const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const camps = require('./routes/camps')(router);
const modules = require('./routes/modules')(router);
const bodyParser = require('body-parser');
const cors = require('cors');

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
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication',authentication);
app.use('/camps',camps);
app.use('/modules',modules);


app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname +'/client/dist/index.html'));
});

app.listen(8080, () =>{
    console.log('Listening on port 8080');
});