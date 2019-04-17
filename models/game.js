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
    specialty_id:String,
    division_id:String,
    roster_id: String,
    coach_ids:[String],
    ref_ids:[String],
    emailSent: {type: Boolean, default: false}
});

module.exports = mongoose.model('Game',gameSchema);