const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const CamperSchema = require('./camper').schema;
const SessionSchema = require('./session').schema;



const rosterSchema = new Schema({
    name: {type:String, required: true},
    campers: [CamperSchema],
    session: SessionSchema
});

module.exports = mongoose.model('Roster',rosterSchema);