const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const CounselorSchema = require('./counselor').schema;
const CamperSchema = require('./camper').schema;
const SessionSchema = require('./session').schema;

const swimGroupSchema = new Schema({
    name: {type:String, required: true},
    lifeguard_id: String,
    camper_ids:[String],
    session_id:String,
    camp_id:String
});

module.exports = mongoose.model('SwimGroup',swimGroupSchema);