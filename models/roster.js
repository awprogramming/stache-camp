const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const SessionSchema = require('./session').schema;



const rosterSchema = new Schema({
    name: {type:String, required: true},
    campers: [String],
    session: SessionSchema
});

module.exports = mongoose.model('Roster',rosterSchema);