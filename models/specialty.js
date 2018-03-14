const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const UserSchema = require('./user').schema;
const RosterSchema = require('./roster').schema;

const specialtySchema = new Schema({
    name: {type:String, required: true},
    head_specialists: [UserSchema],
    rosters: [RosterSchema]
});

module.exports = mongoose.model('Specialty',specialtySchema);