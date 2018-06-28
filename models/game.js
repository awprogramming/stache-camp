const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const RosterSchema = require('./camper').schema;
const CounselorSchema = require('./counselor').schema;
const SpecialtySchema = require('./specialty').schema;

const gameSchema = new Schema({
    name: String,
    date: Date,
    location: String,
    opponent: String,
    needsLunch: Boolean,
    specialty: SpecialtySchema,
    divisionId:String,
    rosterId: String,
    coachIds:[String],
    refIds:[String],
    emailSent: {type: Boolean, default: false}
});

module.exports = mongoose.model('Game',gameSchema);