const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const CounselorSchema = require('./counselor').schema;
const CamperSchema = require('./camper').schema;
const SessionSchema = require('./session').schema;

const swimGroupSchema = new Schema({
    name: {type:String, required: true},
    lifeguardId: String,
    camperIds:[String],
    sessionId:String
});

module.exports = mongoose.model('SwimGroup',swimGroupSchema);