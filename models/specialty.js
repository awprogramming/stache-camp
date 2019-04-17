const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const UserSchema = require('./user').schema;
const RosterSchema = require('./roster').schema;

const specialtySchema = new Schema({
    name: {type:String, required: true},
    camp_id:String,
    head_specialist_ids:[String],
    head_specialists: [UserSchema],
    rosters: [RosterSchema],
    roster_ids:[String]
});

module.exports = mongoose.model('Specialty',specialtySchema);