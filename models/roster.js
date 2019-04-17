const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const SessionSchema = require('./session').schema;



const rosterSchema = new Schema({
    name: {type:String, required: true},
    camper_ids: [String],
    session_id: String,
    specialty_id: String,
    camp_id: String
});

module.exports = mongoose.model('Roster',rosterSchema);